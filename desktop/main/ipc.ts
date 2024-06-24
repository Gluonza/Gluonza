import { app, ipcMain, shell } from "electron";
import path from "node:path";
import {MOD_NAME} from "common/consts.js";

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

ipcMain.handle('update-plugins', (event, pluginPath) => {
  
});