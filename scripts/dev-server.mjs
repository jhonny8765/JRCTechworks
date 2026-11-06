import { spawn } from "node:child_process";

// Accepts both regular npm dev usage and preview tooling's --host/--strictPort flags.
const args = process.argv.slice(2);
const hostPosition = args.indexOf("--host");
const portPosition = args.indexOf("--port");
const host = hostPosition >= 0 ? args[hostPosition + 1] : "127.0.0.1";
const port = portPosition >= 0 ? args[portPosition + 1] : "3000";

const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", "--hostname", host, "--port", port],
  { stdio: "inherit" }
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));
