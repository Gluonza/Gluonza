import fs from "node:fs";
import path from "node:path";
import { ipcRenderer, contextBridge, app } from "electron";
import { coreLogger, MOD_NAME } from "common/consts.js";
import chokidar from "chokidar";

const getPath = (path: Parameters<Electron.App["getPath"]>[0]) => ipcRenderer.sendSync("@gluonza/get-path", path) as string;
const release = ipcRenderer.sendSync("DISCORD_APP_GET_RELEASE_CHANNEL_SYNC") as string;

const appdata = getPath("appData");

const directories = {
  settings: path.join(appdata, "gluonza", "settings", release),
  plugins: path.join(appdata, "gluonza", "plugins"),
  themes: path.join(appdata, "gluonza", "themes")
}

const listeners: { [event: string]: Function[] } = {
  pluginAdd: [],
  pluginChange: [],
  pluginUnlink: [],
  themeChange: [],
  themeAdd: [],
  themeUnlink: []
};

function getPluginDirectories(baseDir: fs.PathLike) {
  return fs.readdirSync(baseDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
}

function readManifest(manifestPath: fs.PathOrFileDescriptor) {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
}

function getMissingManifestFields(manifest: { name: any; authors: any; description: any; version: any; }) {
  return [
    !manifest.name && 'name',
    !manifest.authors && 'authors',
    !manifest.description && 'description',
    !manifest.version && 'version',
  ].filter(Boolean);
}

function logWarning(pluginDir: string, message: string) {
  coreLogger.warn(`${MOD_NAME} -> IPC: ${message} in ${path.join(directories.plugins, pluginDir)}`);
}

function getNativePlugins() {
  try {
    const plugins = [];
    const pluginDirectories = getPluginDirectories(directories.plugins);

    for (const dir of pluginDirectories) {
      try {
        const manifestPath = path.join(directories.plugins, dir, 'manifest.json');
        const indexPath = path.join(directories.plugins, dir, 'index.js');

        if (fs.existsSync(manifestPath) && fs.existsSync(indexPath)) {
          const manifest = readManifest(manifestPath);
          const source = fs.readFileSync(indexPath, 'utf-8');
          const missingManifestFields = getMissingManifestFields(manifest);

          if (!missingManifestFields.includes('name')) plugins.push({ manifest, source });

          if (missingManifestFields.length > 0) {
            logWarning(
                dir,
                `Manifest is missing the following properties: { ${missingManifestFields.join(', ')} }; ` +
                (missingManifestFields.includes('name')
                    ? 'Ignoring. '
                    : 'Loading.')
            );
          }
        } else {
          logWarning(dir, 'manifest.json or index.js missing. Plugin will now not load.');
        }
      } catch (error) {
        console.warn('error:', error);
      }
    }

    return { status: 'success', plugins };
  } catch (error) {
    console.warn(`${MOD_NAME} -> IPC: Error loading plugins:`, error);
    return { status: 'error', message: error.message };
  }
}

function startWatcher() {
  const PathPlugins = path.join(appdata, MOD_NAME, 'plugins');
  const watcherPlugins = chokidar.watch(PathPlugins, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true
  });

  watcherPlugins
      .on('add', (filePath) => {
        coreLogger.info(filePath);
        listeners.pluginAdd.forEach(callback => callback(filePath));
      })
      .on('change', (filePath) => {
        coreLogger.info(filePath);
        listeners.pluginChange.forEach(callback => callback(filePath));
      })
      .on('unlink', (filePath) => {
        coreLogger.info(filePath);
        listeners.pluginUnlink.forEach(callback => callback(filePath));
      });

  const PathThemes = path.join(appdata, MOD_NAME, 'themes');
  const watcherThemes = chokidar.watch(PathThemes, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true
  });

  watcherThemes
      .on('add', (filePath) => {
        listeners.themeAdd.forEach(callback => callback(filePath));
      })
      .on('change', (filePath) => {
        listeners.themeChange.forEach(callback => callback(filePath));
      })
      .on('unlink', (filePath) => {
        listeners.themeUnlink.forEach(callback => callback(filePath));
      });
}

startWatcher();

export const gluonzaNative = {
  app: {
    platform: process.platform,
    release,
    quit() {
      ipcRenderer.invoke("@gluonza/quit");
    },
    restart() {
      ipcRenderer.invoke("@gluonza/restart");
    },
    openPath(path: string) {
      ipcRenderer.invoke('@gluonza/open-path', { p: path });
    }
  },
  plugins: { getNativePlugins, read: (filepath: any) => {return ipcRenderer.invoke('read-file', {filepath: filepath})} },
  storage: {
    read(name: string) {
      const fullpath = path.join(directories.settings, path.basename(name));
      if (!fs.existsSync(fullpath)) return "{}";
      return JSON.parse(fs.readFileSync(fullpath, "binary"));
    },
    write(name: string, data: string) {
      const fullpath = path.join(directories.settings, path.basename(name));
      const parsedData = JSON.stringify(data);
      fs.writeFileSync(fullpath, parsedData, "binary");
    }
  },
  listeners: {
    addListener(event: keyof typeof listeners, callback: Function) {
      if (listeners[event]) {
        listeners[event].push(callback);
      }
    },
    removeListener(event: keyof typeof listeners, callback: Function) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      }
    }
  }
};

if (process.contextIsolated) contextBridge.exposeInMainWorld("gluonzaNative", gluonzaNative);
Object.defineProperty(window, "gluonzaNative", {
  value: gluonzaNative
});
