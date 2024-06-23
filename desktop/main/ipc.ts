import { app, ipcMain } from "electron";

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