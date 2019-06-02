'use strict';

import { app, BrowserWindow } from 'electron';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
  console.log('global.__static', global.__static);
}

let mainWindow;

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/welcome.html`
  : `file://${__dirname}/welcome.html`;

function appOnReady () {
  console.log(process, process.argv);

  // 设置应用名字
  app.setName('旅行计划');
  // BrowserWindow.addDevToolsExtension(path.join(os.homedir(), 'Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.1.0_0'));

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    center: true, // 窗口居中
    webPreferences: { // 网页功能的设置
      devTools: true, //  是否开启 DevTools
      nodeIntegration: true,
      textAreasAreResizable: false // 禁止TextArea元素调整大小
    },
    frame: false, // 无边框
    titleBarStyle: 'hiddenInset', // macOS, 左上角仍然有标准的窗口控制按钮，其中控制按钮到窗口边框的距离更大。
    show: false,
    fullscreen: false,
    fullscreenable: false
  });

  // 关闭主窗口
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', appOnReady);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    appOnReady();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
