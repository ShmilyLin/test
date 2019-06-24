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

// require("./Main/database.js");


/**
* =====================================
* 
* 常量
* 
* =====================================
*/
// 主窗口
let mainWindow;
let RenderListener = {};

// app.commandLine.appendSwitch('remote-debugging-port', '8315')
// 设置应用名字
// app.setName("旅行计划");

/**
* =====================================
* 
* 事件
* 
* =====================================
*/
// 当 Electron 完成初始化时被触发。 
// 在 macOS 中, 如果从通知中心中启动，那么 launchInfo 中的 userInfo 包含用来打开应用程序的 NSUserNotification 信息。 你可以通过调用 app.isReady() 方法来检查此事件是否已触发。
function appOnReady () {
  // console.log(process.argv);

  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }

  // 设置应用名字
  // app.setName("旅行计划");

  // Vue DevTools nhdogjmejiglipccpnnnanhbledajbpd
  // React DevTools nlipoenfbbikpbjkfpfillcgkoblgpmj
  
  mainWindow = new BrowserWindow({
      width: 1000,
      height: 700,
      minWidth: 800,
      minHeight: 600,
      center: true, // 窗口居中
      webPreferences: { // 网页功能的设置 
        devTools: true, //  是否开启 DevTools
        nodeIntegration: true,
        textAreasAreResizable: false, // 禁止TextArea元素调整大小
      },
      frame: false, // 无边框
      titleBarStyle: 'hiddenInset', // macOS, 左上角仍然有标准的窗口控制按钮，其中控制按钮到窗口边框的距离更大。
      show: false,
      fullscreen: false,
      fullscreenable: false,
  })

  // 关闭主窗口
  mainWindow.on('closed', function () {
      mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
      mainWindow.show()
  })

  if (global.needOpenFile) {
    // TODO: 需要打开文件
  }else {
    if (process.env.runtype === 'dev') {
      mainWindow.loadURL('http://localhost:3000/welcome.html');
      mainWindow.webContents.openDevTools({
        mode: "detach",
      })
    }else {
      mainWindow.loadFile('build/welcome.html');
    }
  }

  const menu = Menu.buildFromTemplate(getMenuOption());
  Menu.setApplicationMenu(menu);
}

/**
* =====================================
* 
* 应用
* 
* =====================================
*/
// 当 Electron 完成初始化时被触发。 
// 在 macOS 中, 如果从通知中心中启动，那么 launchInfo 中的 userInfo 包含用来打开应用程序的 NSUserNotification 信息。 你可以通过调用 app.isReady() 方法来检查此事件是否已触发。
app.on('ready', appOnReady);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
// On macOS it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
if (process.platform !== 'darwin') app.quit()
})

// 当应用被激活时发出。 
// 各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它。
app.on('activate', function () {
if (mainWindow === null) appOnReady()
})

app.on('open-file', function (event, path) {
console.log('【App】[open-file] ', event, path);

// process.argv
// event.preventDefault()
})

/**
* =====================================
* 
* 消息
* 
* =====================================
*/
ipcMain.on('create-a-new-plan', (event, arg) => {
console.log("【Main】 create-a-new-plan", arg);
mainWindow.loadFile('./src/pages/plan/index.html');
})

ipcMain.on('create-hotel-card', (event, arg) => {
console.log("【Main】 create-hotel-card", arg);
let childWindow = new BrowserWindow({
  width: 500,
  height: 600,
  resizable: false,
  parent: mainWindow, 
  show: false,
  center: true, // 窗口居中
  webPreferences: { // 网页功能的设置 
    devTools: true, //  是否开启 DevTools
    nodeIntegration: true,
    textAreasAreResizable: false, // 禁止TextArea元素调整大小
  },
  frame: false, // 无边框
  titleBarStyle: 'hiddenInset', 
  fullscreen: false,
  fullscreenable: false,
  maximizable: false,
  minimizable: false,
  movable: false,
})

childWindow.once('ready-to-show', () => {
  childWindow.show();
})
childWindow.on('closed', () => {
  mainWindow.webContents.send('child-window-closed');
});
childWindow.loadFile('./src/modals/CreateHotelCard/CreateHotelCard.html');
})

ipcMain.on('ipc-renderer-listener-on', (event, arg) => {
console.log("ipc-renderer-listener-on", event, arg);
if (!RenderListener[arg.eventKey]) {
    RenderListener[arg.eventKey] = [arg.id];
}else {
    if (RenderListener[arg.eventKey].indexOf(arg.id) < 0) {
        RenderListener[arg.eventKey].push(arg.id);
    }
}

console.log("ipc-renderer-listener-on", RenderListener);
})

ipcMain.on('ipc-renderer-listener-once', (event, arg) => {
console.log("ipc-renderer-listener-once", event, arg);
if (!RenderListener[arg.eventKey + '_once']) {
  RenderListener[arg.eventKey + '_once'] = [arg.id];
}else {
  if (RenderListener[arg.eventKey + '_once'].indexOf(arg.id) < 0) {
      RenderListener[arg.eventKey + '_once'].push(arg.id);
  }
}

console.log("ipc-renderer-listener-once", RenderListener);
})

ipcMain.on('ipc-renderer-listener-done', (event, arg) => {
console.log("ipc-renderer-listener-done", event, arg);
var tempIDList = RenderListener[arg.eventKey];
var tempOnceIDList = RenderListener[arg.eventKey + '_once'];
RenderListener[arg.eventKey + '_once'] = [];

if (tempOnceIDList && tempOnceIDList.length > 0) {
  tempIDList = tempIDList.concat(tempOnceIDList);
}

if (tempIDList && tempIDList.length > 0) {
  for (var i = 0; i < tempIDList.length; i++) {
      var tempWebContents = webContents.fromId(tempIDList[i]);
      if (tempWebContents) {
        console.log("ipc-renderer-listener-done send", arg.eventKey, arg.params);
          tempWebContents.send(arg.eventKey, arg.params);
      }
  }
}

console.log("ipc-renderer-listener-done", RenderListener);
})

ipcMain.on('ipc-renderer-listener-off', (event, arg) => {
console.log("ipc-renderer-listener-off", event, arg);
var tempIDList = RenderListener[arg.eventKey];
if (tempIDList && tempIDList.length > 0) {
  for (var i = 0; i < tempIDList.length; i++) {
      RenderListener[arg.eventKey].splice(i, 1);
      break;
  }
}

var tempOnceIDList = RenderListener[arg.eventKey + '_once'];
if (tempOnceIDList && tempOnceIDList.length > 0) {
  for (var i = 0; i < tempOnceIDList.length; i++) {
      RenderListener[arg.eventKey + '_once'].splice(i, 1);
      break;
  }
}

console.log("ipc-renderer-listener-off", RenderListener);
})


/**
* =====================================
* 
* 配置
* 
* =====================================
*/
function getMenuOption () {
return [{
  label: app.getName(),
  submenu: [{
    label: "关于 " + app.getName(),
    role: "about"
  }, {
    label: "偏好设置",
  }]
}, {
  label: "文件",
  submenu: [{
    label: "新建计划",
    accelerator: "CommandOrControl+N"
  }, {
    type: "separator"
  }, {
    label: "打开",
    accelerator: "CommandOrControl+O"
  }]
}, {
  label: "编辑",
  submenu: [{
    label: "撤销",
    role: "undo"
  }, {
    label: "恢复",
    role: "redo"
  }, {
    type: "separator"
  }, {
    label: "剪切",
    role: "cut"
  }, {
    label: "复制",
    role: "copy"
  }, {
    label: "粘贴",
    role: "paste"
  }]
}, {
  label: "调试",
  submenu: [{
    label: "打开调试",
    role: "toggledevtools"
  }, {
    type: "separator"
  }, {
    label: "重载页面",
    role: "reload"
  }]
}]
}