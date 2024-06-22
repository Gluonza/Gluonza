import { app, ipcMain } from "electron";
import path from "node:path";

ipcMain.on("@gluanza/get-path", (event, path) => {
  event.returnValue = app.getPath(path);
});
ipcMain.handle("@gluanza/quit", () => {
  app.quit();
});
ipcMain.handle("@gluanza/restart", () => {
  app.quit();
  app.relaunch();
});