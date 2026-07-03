import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function storageDevPlugin() {
  const appdataDir = path.join(process.env.APPDATA || os.homedir(), "germ");
  const appdataFile = path.join(appdataDir, "shared-progress.json");
  const workspaceFile = path.resolve(__dirname, "./shared-progress.json");

  function readSharedStorage() {
    let appdataData = { items: {} };
    let workspaceData = { items: {} };

    try {
      if (fs.existsSync(appdataFile)) {
        appdataData = JSON.parse(fs.readFileSync(appdataFile, "utf8"));
      }
    } catch (e) {}

    try {
      if (fs.existsSync(workspaceFile)) {
        workspaceData = JSON.parse(fs.readFileSync(workspaceFile, "utf8"));
      }
    } catch (e) {}

    const mergedItems = { ...(appdataData.items || {}), ...(workspaceData.items || {}) };
    const appdataTime = appdataData.updatedAt ? new Date(appdataData.updatedAt).getTime() : 0;
    const workspaceTime = workspaceData.updatedAt ? new Date(workspaceData.updatedAt).getTime() : 0;
    let mergedUpdatedAt = appdataData.updatedAt || workspaceData.updatedAt || new Date().toISOString();

    if (appdataTime > workspaceTime) {
      Object.assign(mergedItems, appdataData.items || {});
      mergedUpdatedAt = appdataData.updatedAt;
    } else if (workspaceTime > appdataTime) {
      Object.assign(mergedItems, workspaceData.items || {});
      mergedUpdatedAt = workspaceData.updatedAt;
    }

    return { items: mergedItems, updatedAt: mergedUpdatedAt };
  }

  function writeSharedStorage(next) {
    const raw = JSON.stringify(next, null, 2);
    try {
      fs.mkdirSync(appdataDir, { recursive: true });
      fs.writeFileSync(appdataFile, raw);
    } catch (e) {}
    try {
      fs.writeFileSync(workspaceFile, raw);
    } catch (e) {}
  }

  return {
    name: "germ-storage-dev-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/storage") {
          res.setHeader("Content-Type", "application/json");
          if (req.method === "GET") {
            res.end(JSON.stringify(readSharedStorage()));
            return;
          }
          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", () => {
              try {
                const parsed = JSON.parse(body || "{}");
                const incoming = parsed?.items;
                if (!incoming || typeof incoming !== "object") {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: "missing items" }));
                  return;
                }
                const current = readSharedStorage();
                const items = { ...(current.items || {}) };
                for (const [key, value] of Object.entries(incoming)) {
                  if (typeof key !== "string") continue;
                  if (value == null) delete items[key];
                  else items[key] = String(value);
                }
                const nextData = { items, updatedAt: new Date().toISOString() };
                writeSharedStorage(nextData);
                res.end(JSON.stringify({ ok: true, count: Object.keys(items).length }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [storageDevPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Forward TTS requests to the Node voice server in dev.
      "/api": "http://localhost:3001",
    },
  },
});
