const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Ecommerce Store",
    width: 1500,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
    },
  });

  mainWindow.webContents.on("did-fail-load", () => {
    // console.log("did-fail-load");
    mainWindow.loadFile("dist/electron-angular/index.html");
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/electron-angular/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
