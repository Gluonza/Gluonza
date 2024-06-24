import fs from "node:fs";
import path from "node:path";
import { ipcRenderer, contextBridge } from "electron";
import {plugins} from "../../gluonza/api/systems/plugins.js";
import {MOD_NAME} from "common/consts.js";

const getPath = (path: Parameters<Electron.App["getPath"]>[0]) => ipcRenderer.sendSync("@gluonza/get-path", path) as string;

const release = ipcRenderer.sendSync("DISCORD_APP_GET_RELEASE_CHANNEL_SYNC") as string;

const appdata = getPath("appData");

const directories = {
  settings: path.join(appdata, "gluonza", "settings", release),
  plugins: path.join(appdata, "gluonza", "plugins"),
  themes: path.join(appdata, "gluonza", "themes")
}

function getNativePlugins() {
  try {
    const plugins = [];

    const pluginDirectories = fs.readdirSync(directories.plugins, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const dir of pluginDirectories) {
      try {
        const manifestPath = path.join(directories.plugins, dir, 'manifest.json');
        const indexPath = path.join(directories.plugins, dir, 'index.js');

        if (fs.existsSync(manifestPath) && fs.existsSync(indexPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

          const source = fs.readFileSync(indexPath, 'utf-8');

          const missingManifestFields = [
            !manifest.name && 'name',
            !manifest.authors && 'authors',
            !manifest.description && 'description',
            !manifest.version && 'version',
          ].filter(Boolean);

          if (!missingManifestFields.includes('name')) {

            plugins.push({
              manifest,
              source,
            });
          }

          if (missingManifestFields.length > 0)
            console.warn(
                `${MOD_NAME} -> IPC:`,
                `manifest for plugin in ${path.join(directories.plugins, dir)} is missing field(s):`,
                `{ ${missingManifestFields.join(', ')} };`,
                missingManifestFields.includes('name')
                    ? 'ignoring since important identifier props like { name } is omitted.'
                    : 'allowing since important identifier props like { name } is not omitted.',
            );
        } else
          console.warn(
              `${MOD_NAME} -> IPC:`,
              `manifest.json or index.js not found in ${path.join(directories.plugins, dir)}`
          );
      } catch (error) {
        console.warn('error:', error);
      }
    }

    return { status: 'success', plugins };
  } catch (error) {
    console.warn(`${MOD_NAME} -> IPC:`, 'Error loading plugins:', error);
    return { status: 'error', message: error.message };
  }
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
  plugins: {getNativePlugins},
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