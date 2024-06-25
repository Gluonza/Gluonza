import {app, ipcMain, shell} from "electron";
import path from "node:path";
import {coreLogger, MOD_NAME} from "common/consts.js";
import fs from "node:fs";
import {join} from "path";

ipcMain.on("@gluonza/get-path", (event, path) => {
  event.returnValue = app.getPath(path);
});
ipcMain.handle("@gluonza/quit", () => {
  app.quit();
});
ipcMain.handle("@gluonza/restart", () => {
  app.quit();
  app.relaunch();
});

// @ts-ignore
ipcMain.handle("@gluonza/open-path", (event, { p }) => {
  const mainPath = path.join(app.getPath('appData'),MOD_NAME, p);

  shell.openPath(mainPath);

  return { status: 'success' };
});

const isValidFilePath = (filepath) => {
  const validDirectory = path.join(app.getPath('appData'),MOD_NAME);
  const resolvedPath = path.resolve(filepath);
  return resolvedPath.startsWith(validDirectory);
};

ipcMain.handle('read-file', async (event, {filepath}) => {
  try {
    if (!isValidFilePath(filepath)) {
      throw new Error('Invalid file path');
    }
    // @ts-ignore
    const directory = path.dirname(filepath);
    return {source: fs.readFileSync(filepath, "binary"), manifest: fs.readFileSync(path.join(directory, 'manifest.json'),"binary")}
  } catch (error) {
    console.error('Failed to read file:', error);
    throw error;
  }
});