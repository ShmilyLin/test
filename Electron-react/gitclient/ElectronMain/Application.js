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
const MenuManager = require('./MenuManager');
const FileManager = require('./FileManager');

class Application {
    constructor() {
        this.MainWindow = null;
        this.SettingsWindow = null;

        MenuManager.menuOpenPreferences = this.openSettings.bind(this);

        ipcMain.on('ShowSettingsWindow', (event, arg) => {
            this.openSettings();
        })

        this.ready = this.ready.bind(this);
        this.activate = this.activate.bind(this);
        this.windowAllClosed = this.windowAllClosed.bind(this);
        this.openSettings = this.openSettings.bind(this);
    }

    ready() {
        console.log('【Application】 ready');

        FileManager.checkSettingsFile();
        // 设置应用名字
        // app.setName("Git Viewer");

        // Vue DevTools nhdogjmejiglipccpnnnanhbledajbpd
        // BrowserWindow.addDevToolsExtension(path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.1.0_0'))

        this.MainWindow = new BrowserWindow({
            width: 1000,
            height: 700,
            minWidth: 800,
            minHeight: 600,
            center: true, // 窗口居中
            webPreferences: { // 网页功能的设置 
            devTools: true, //  是否开启 DevTools
            nodeIntegration: true,
            textAreasAreResizable: false, // 禁止TextArea元素调整大小
            webSecurity: false, // 允许跨域
            },
            frame: false, // 无边框
            titleBarStyle: 'hiddenInset', // macOS, 左上角仍然有标准的窗口控制按钮，其中控制按钮到窗口边框的距离更大。
            show: false,
            fullscreen: false,
            fullscreenable: false,
        });

        // 关闭主窗口
        this.MainWindow.on('closed', () => {
            this.MainWindow = null;
        });

        this.MainWindow.once('ready-to-show', () => {
            this.MainWindow.webContents.openDevTools({
                mode: 'detach',
            });

            this.MainWindow.show();
        });

        // 网页变得未响应时触发
        this.MainWindow.on('unresponsive', () => {
            this.MainWindow.reload();
        });

        // 当窗口获得焦点时触发
        this.MainWindow.on('focus', () => {
            if (this.SettingsWindow) {
                if (!this.SettingsWindow.isFocused()) {
                    this.SettingsWindow.focus();
                }
            }
        });

        if (global.needOpenFile) {
            // TODO: 需要打开文件
        }else {
            // if (process.env.runtype === 'dev') {
                this.MainWindow.loadURL('http://localhost:3000/main.html');
            // }else {
            // mainWindow.loadFile('dist/main.html');
            // }
        }

        const menu = Menu.buildFromTemplate(MenuManager.getGlobalMenuOption());
        Menu.setApplicationMenu(menu);
    }

    activate() {
        if (this.MainWindow === null) {
            this.ready();
        } else {
            if (this.SettingsWindow) {
                this.SettingsWindow.focus();
            } else {
                this.MainWindow.focus();
            }
            
            return;
        }
    }

    windowAllClosed() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }

    openSettings() {
        if (this.SettingsWindow) {
            this.SettingsWindow.focus();
            return;
        }

        this.SettingsWindow = new BrowserWindow({
            width: 700,
            height: 600,
            resizable: false,
            show: false,
            center: true, // 窗口居中
            webPreferences: { // 网页功能的设置 
                devTools: true, //  是否开启 DevTools
                nodeIntegration: true,
                textAreasAreResizable: false, // 禁止TextArea元素调整大小
                webSecurity: false, // 允许跨域
            },
            frame: false, // 无边框
            titleBarStyle: 'hiddenInset', 
            fullscreen: false,
            fullscreenable: false,
            maximizable: false,
            minimizable: false,
        })
        
        this.SettingsWindow.once('ready-to-show', () => {
            this.SettingsWindow.show();
        })

        this.SettingsWindow.on('closed', () => {
            this.SettingsWindow = null;
            // this.SettingsWindow.webContents.send('child-window-closed');
        });

          // 网页变得未响应时触发
        this.SettingsWindow.on('unresponsive', () => {
            this.SettingsWindow.reload();
        });

        //   this.SettingsWindow.loadFile('./src/modals/CreateHotelCard/CreateHotelCard.html');
        this.SettingsWindow.loadURL('http://localhost:3000/settings.html');
    }
}

// export default Application;
module.exports = Application;
