import { app, ipcMain } from "electron";
import fs from "node:fs";
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