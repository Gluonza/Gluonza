import fs from "node:fs";
import path from "node:path";
import { ipcRenderer, contextBridge } from "electron";

const getPath = (path: Parameters<Electron.App["getPath"]>[0]) => ipcRenderer.sendSync("@gluonza/get-path", path) as string;

const release = ipcRenderer.sendSync("DISCORD_APP_GET_RELEASE_CHANNEL_SYNC") as string;

const appdata = getPath("appData");

const directories = {
  settings: path.join(appdata, "gluonza", "settings", release),
  plugins: path.join(appdata, "gluonza", "plugins"),
  themes: path.join(appdata, "gluonza", "themes")
}

export const gluonzaNative = {
  app: {
    platform: process.platform,
    release,
    quit() {
      ipcRenderer.invoke("@gluonza/quit");
    },
    restart() {
      ipcRenderer.invoke("@gluonza/restart");
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

if (process.contextIsolated) contextBridge.exposeInMainWorld("gluonzaNative", gluonzaNative);
Object.defineProperty(window, "gluonzaNative", {
  value: gluonzaNative
});