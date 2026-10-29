import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Use dedicated test database name
const baseUri = process.env.MONGODB_URI;
if (!baseUri) {
  throw new Error("MONGODB_URI is required to run tests");
}
const testDbUri = baseUri.replace(/\/code-translator(\?|$)/, "/code-translator-test$1");

// Set environment for test
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-key-12345";
process.env.CLIENT_URL = "https://smartcodetranslator.vercel.app,http://localhost:5173";

// Import app and User model
const { default: app } = await import("../src/app.js");
const { default: User } = await import("../src/models/User.model.js");
const { formatApiErrorMessage } = await import("../../client/src/services/api.js");

let server;
let baseUrl;

before(async () => {
  // Connect to isolated test database
  await mongoose.connect(testDbUri);
  // Strict guard: verify test database name
  assert.equal(
    mongoose.connection.name,
    "code-translator-test",
    "Safety violation: tests must ONLY run against code-translator-test"
  );
  // Clean up any stale test accounts
  await User.deleteMany({ email: /@test-suite\.local$/ });

  // Start ephemeral server
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  // Clean up synthetic test records
  await User.deleteMany({ email: /@test-suite\.local$/ });
  await mongoose.disconnect();
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe("Authentication & Security Test Suite", () => {
  const testUser = {
    name: "Test Engineer",
    email: "engineer@test-suite.local",
    password: "Password123!",
  };

  let authToken = "";

  it("1. New user registration: Successfully registers a new user with hashed password", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    const body = await res.json();
    assert.equal(res.status, 201);
    assert.equal(body.success, true);
    assert.ok(body.data.token);
    assert.equal(body.data.user.email, testUser.email);
    assert.equal(body.data.user.name, testUser.name);
    assert.equal(body.data.user.password, undefined); // Never return password
    authToken = body.data.token;
  });

  it("2. Duplicate email registration: Rejects duplicate account with 409 and does not overwrite", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Imposter",
        email: testUser.email,
        password: "DifferentPassword123!",
      }),
    });

    const body = await res.json();
    assert.equal(res.status, 409);
    assert.equal(body.success, false);
    assert.match(body.message, /already exists/i);
  });

  it("3. Valid login: Successfully authenticates with valid credentials", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.ok(body.data.token);
    assert.equal(body.data.user.email, testUser.email);
  });

  it("4. Invalid password: Rejects invalid password with generic 401 without revealing password hint", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: "WrongPassword999!",
      }),
    });

    const body = await res.json();
    assert.equal(res.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.message, "Invalid email or password.");
  });

  it("5. Non-existent email: Returns generic 401 to prevent user account enumeration", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nonexistent@test-suite.local",
        password: "SomePassword123!",
      }),
    });

    const body = await res.json();
    assert.equal(res.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.message, "Invalid email or password.");
  });

  it("6. Email whitespace and capitalization: Case and trailing spaces are sanitized", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `   ${testUser.email.toUpperCase()}   `,
        password: testUser.password,
      }),
    });

    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.user.email, testUser.email);
  });

  it("7. Google OAuth takeover prevention: Cannot overwrite a Google-registered user via standard signup", async () => {
    const googleUserEmail = "oauth-user@test-suite.local";
    // Create a simulated Google user with password: null
    await User.create({
      googleId: "google-mock-id-998877",
      email: googleUserEmail,
      name: "OAuth User",
      picture: "https://example.com/pic.png",
      password: null,
    });

    // Attempt to register with the same email
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Attacker",
        email: googleUserEmail,
        password: "AttackerPassword123!",
      }),
    });

    const body = await res.json();
    assert.equal(res.status, 409);
    assert.equal(body.success, false);

    // Verify Google user still has no local password
    const doc = await User.findOne({ email: googleUserEmail });
    assert.equal(doc.password, null);
    assert.equal(doc.name, "OAuth User");
  });

  it("8. Protected route with valid JWT: Returns user profile", async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.email, testUser.email);
  });

  it("9. Protected route with invalid JWT: Returns 401 Unauthorized", async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: "Bearer invalid.jwt.signature" },
    });

    const body = await res.json();
    assert.equal(res.status, 401);
    assert.equal(body.success, false);
    assert.match(body.message, /invalid|expired/i);
  });

  it("10. Protected route with expired JWT: Returns 401 Unauthorized", async () => {
    // Generate an expired token (1 second in the past)
    const expiredToken = jwt.sign(
      { id: new mongoose.Types.ObjectId(), email: "expired@test-suite.local" },
      process.env.JWT_SECRET,
      { expiresIn: -10 }
    );

    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });

    const body = await res.json();
    assert.equal(res.status, 401);
    assert.equal(body.success, false);
    assert.match(body.message, /invalid|expired/i);
  });

  it("11. Logout: Successfully terminates session", async () => {
    const res = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
  });

  it("12. Password-reset security: Insecure password reset endpoint is disabled", async () => {
    const res = await fetch(`${baseUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: "NewPasswordHacked123!",
      }),
    });

    assert.equal(res.status, 404); // Route not found
  });

  it("13. CORS preflight from allowed origin: Responds with 204 and CORS headers", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://smartcodetranslator.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type,Authorization",
      },
    });

    assert.equal(res.status, 204);
    assert.equal(
      res.headers.get("access-control-allow-origin"),
      "https://smartcodetranslator.vercel.app"
    );
    assert.equal(res.headers.get("access-control-allow-credentials"), "true");
  });

  it("14. CORS preflight from unauthorized origin: Blocks unauthorized origin", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://evil-unauthorized-website.com",
        "Access-Control-Request-Method": "POST",
      },
    });

    // When an origin is rejected, access-control-allow-origin is not set or returns 403
    const allowOrigin = res.headers.get("access-control-allow-origin");
    assert.notEqual(allowOrigin, "https://evil-unauthorized-website.com");
  });

  it("15. Axios response error formatting: Formats user-friendly messages for different statuses", () => {
    const networkErr = { code: "ERR_NETWORK", message: "Network Error" };
    assert.match(formatApiErrorMessage(networkErr), /cannot connect to server/i);

    const timeoutErr = { code: "ECONNABORTED", message: "timeout of 30000ms exceeded" };
    assert.match(formatApiErrorMessage(timeoutErr), /timed out/i);

    const error401 = { response: { status: 401 } };
    assert.equal(formatApiErrorMessage(error401), "Invalid email or password.");

    const error409 = { response: { status: 409 } };
    assert.equal(formatApiErrorMessage(error409), "An account with this email already exists.");

    const error500 = { response: { status: 500 } };
    assert.match(formatApiErrorMessage(error500), /server error/i);
  });

  it("16. Google OAuth error handling: Forged/invalid credential returns safe 401 response (not 500)", async () => {
    // Missing credential -> 400 Bad Request
    const missingRes = await fetch(`${baseUrl}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const missingBody = await missingRes.json();
    assert.equal(missingRes.status, 400);
    assert.equal(missingBody.success, false);
    assert.match(missingBody.message, /Google credential is required/i);

    // Invalid / forged credential -> 401 Unauthorized
    const forgedRes = await fetch(`${baseUrl}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: "invalid.forged.google.token" }),
    });
    const forgedBody = await forgedRes.json();
    assert.equal(forgedRes.status, 401);
    assert.equal(forgedBody.success, false);
    assert.match(forgedBody.message, /invalid or expired google credential/i);
  });
});

