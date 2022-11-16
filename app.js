const { app, BrowserWindow, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const electronLog = require("electron-log");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let splash;
const createSplash = () => {
  splash = new BrowserWindow({
    width: 600,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: __dirname + "./electron-files/favicon.ico",
  });
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
    },
    icon: __dirname + "./electron-files/favicon.ico",
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  // menu bar
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  // mainWindow.once("ready-to-show", () => {
  //   autoUpdater.checkForUpdatesAndNotify();
  // });
}

/*Checking updates just after app launch and also notify for the same*/

app.on("ready", async () => {
  createSplash();
  splash.loadFile("./electron-files/splash.html");
  splash.center();
  setTimeout(function () {
    createWindow();
    splash.close();
    mainWindow.show();
  }, 3000);
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", function () {
  // if (app.listeners('window-all-closed').length === 1 && !option.interactive) {
  //   app.quit()
  // }

  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

ipcMain.on("error", (event, args) => {
  // event.sender.send('error', args);
  electronLog.error(args);
});

// auto update //

/*checking for updates*/
autoUpdater.on("checking-for-update", () => {
  //your code
  log.info("checking-for-update");
  mainWindow.webContents.send("checking-for-update");
});

/*No updates available*/
autoUpdater.on("update-not-available", (info) => {
  //your code
  log.info("update-not-available");
  mainWindow.webContents.send("update-not-available");
});

/*New Update Available*/
autoUpdater.on("update-available", (info) => {
  //your code
  log.info("update-available");
  mainWindow.webContents.send("update-available");
  //autoUpdater.autoDownload();
});

/*Download Status Report*/
autoUpdater.on("download-progress", (progressObj) => {
  //your code
  log.info("download-progress");
  mainWindow.webContents.send("download-progress");
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
  //your code
  log.info("update-downloaded");
  mainWindow.webContents.send("update-downloaded");
});
autoUpdater.on("error", (err) => {
  log.error(`Update-Error: ${err.toString()}`);
  mainWindow.webContents.send(
    "message",
    `Error in auto-updater: ${err.toString()}`
  );
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
