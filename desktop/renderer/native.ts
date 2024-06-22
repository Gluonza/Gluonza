import fs from "node:fs";
import path from "node:path";
import { ipcRenderer, contextBridge } from "electron";

const getPath = (path: Parameters<Electron.App["getPath"]>[0]) => ipcRenderer.sendSync("@gluanza/get-path", path) as string;

const release = ipcRenderer.sendSync("DISCORD_APP_GET_RELEASE_CHANNEL_SYNC") as string;

const appdata = getPath("appData");

const directories = {
  settings: path.join(appdata, "gluanza", "settings", release),
  plugins: path.join(appdata, "gluanza", "plugins"),
  themes: path.join(appdata, "gluanza", "themes")
}

export const gluanzaNative = {
  app: {
    platform: process.platform,
    release,
    quit() {
      ipcRenderer.invoke("@gluanza/quit");
    },
    restart() {
      ipcRenderer.invoke("@gluanza/restart");
    }
  },
  storage: {
    read(name: string) {
      const fullpath = path.join(directories.settings, path.basename(name));
      if (!fs.existsSync(fullpath)) return "{}";
      return fs.readFileSync(fullpath, "binary");
    },
    write(name: string, data: string) {
      const fullpath = path.join(directories.settings, path.basename(name));

      fs.writeFileSync(fullpath, data, "binary");
    }
  }
}

if (process.contextIsolated) contextBridge.exposeInMainWorld("gluanzaNative", gluanzaNative);
Object.defineProperty(window, "gluanzaNative", {
  value: gluanzaNative
});