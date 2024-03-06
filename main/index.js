import fs from "node:fs/promises";
import path from "node:path";
import { ipcMain as ipc } from "electron-better-ipc";
import wrapResponse from "./plugins/wrapResponse";
(async () => {
  const dirs = await fs.readdir(path.resolve(__dirname, "api"), {
    recursive: true,
  });
  const plugins = {
    connection: null,
  };
  const apiDirs = [];
  for (const dir of dirs) {
    const stats = await fs.stat(dir);
    if (stats.isFile()) {
      apiDirs.push(dir.replace(/\/index$/, ""));
    }
  }
  ipc.answerRenderer("api", async (request) => {
    const { path } = request;
    const match = apiDirs.find((item) => item === path.replace("-", "/"));
    if (match) {
      const actions = (await import(match)).default;
      const ret = await actions(plugins, request);
      return wrapResponse(ret);
    }
  });
})();
