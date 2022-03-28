const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  ipcMain,
} = require("electron");
const path = require("path");
const url = require("url");
const Store = require("electron-store");
const store = new Store();
const { SEND_MAIN_PING, SEND_WEB_PING } = require("../src/constants");

const menus = [
  { label: "About", submenu: [{ label: "Who You", role: "about" }] },
  {
    label: "Preferences",
    submenu: [
      { label: "Close", role: "close", accelerator: "CommandOrControl+W" },
      { label: "Quit", role: "quit", accelerator: "CommandOrControl+Q" },
      { lable: "Reload", role: "reload", accelerator: "CommandOrControl+R" },
    ],
  },
];
const customMenu = Menu.buildFromTemplate(menus);

const createWindow = () => {
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true,
    });
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // Chrome Developer Tools
  // win.webContents.openDevTools();
  console.log(store.get("todo_list"));
  win.webContents.on("did-finish-load", () => {
    win.webContents.send(SEND_WEB_PING, store.get("todo_list"));
  });
  win.loadURL(startUrl);
};

app.setAboutPanelOptions({
  applicationName: "Elec_Todo",
  copyright: "MIT",
  applicationVersion: "v_1.0.0",
  version: "v_1.0.0",
  authors: ["Junwon", "Jang"],
  website: "https://github.com/anxi0",
  iconPath: "./image.PNG",
});

app.on("ready", () => {
  createWindow();
  Menu.setApplicationMenu(customMenu);
});
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

ipcMain.on(SEND_MAIN_PING, (event, arg) => {
  store.set("todo_list", arg);
});
