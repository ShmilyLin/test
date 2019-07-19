/**
 * =====================================
 * 
 * 引用
 * 
 * =====================================
 */
const {
  app, 
  Menu, 
  BrowserWindow, 
  webContents,
  ipcMain
} = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const Application = require('./ElectronMain/Application');

// require("./Main/database.js");

/**
* =====================================
* 
* 应用
* 
* =====================================
*/
let application = new Application();

// app.commandLine.appendSwitch('remote-debugging-port', '8315')
// 设置应用名字
// app.setName("旅行计划");

// 当 Electron 完成初始化时被触发。 
// 在 macOS 中, 如果从通知中心中启动，那么 launchInfo 中的 userInfo 包含用来打开应用程序的 NSUserNotification 信息。 你可以通过调用 app.isReady() 方法来检查此事件是否已触发。
app.on('ready', application.ready);

// Quit when all windows are closed.
app.on('window-all-closed', application.windowAllClosed);

// 当应用被激活时发出。 
// 各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它。
app.on('activate', application.activate);

app.on('open-file', function (event, path) {
  console.log('【App】[open-file] ', event, path);
})

/**
* =====================================
* 
* 常量
* 
* =====================================
*/

/**
* =====================================
* 
* 事件
* 
* =====================================
*/

/**
* =====================================
* 
* 消息
* 
* =====================================
*/

/**
* =====================================
* 
* 方法
* 
* =====================================
*/

/**
* =====================================
* 
* 配置
* 
* =====================================
*/
