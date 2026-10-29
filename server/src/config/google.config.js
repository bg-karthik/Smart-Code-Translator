import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (credential) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      const err = new Error("Invalid Google token payload.");
      err.statusCode = 401;
      throw err;
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    const authError = new Error("Invalid or expired Google credential.");
    authError.statusCode = 401;
    throw authError;
  }
};

export { googleClient, verifyGoogleToken };
