const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function main() {
  const serverModuleUrl = pathToFileURL(path.resolve(__dirname, "../server/index.js")).href;
  const { startServer } = await import(serverModuleUrl);
  const server = await startServer(0);

  try {
    const address = server.address();
    assert.equal(typeof address, "object", "The local API should listen on a TCP address.");
    assert.equal(address.address, "127.0.0.1", "The local API must bind only to IPv4 loopback.");
  } finally {
    await closeServer(server);
  }

  console.log("Server loopback check passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
