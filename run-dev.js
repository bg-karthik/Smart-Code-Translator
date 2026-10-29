import { spawn } from "child_process";

console.log("==========================================");
console.log("  Starting Smart Code Translator Services  ");
console.log("==========================================\n");

console.log("🚀 Starting Backend Server (http://localhost:5000)...");
const server = spawn("node", ["server.js"], {
  cwd: "./server",
  shell: true,
  stdio: "inherit",
});

console.log("🌐 Starting Frontend Client (http://localhost:5173)...");
const client = spawn("npm", ["run", "dev"], {
  cwd: "./client",
  shell: true,
  stdio: "inherit",
});

const cleanup = () => {
  console.log("\n🛑 Stopping all services...");
  try {
    server.kill();
    client.kill();
  } catch (e) {}
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

