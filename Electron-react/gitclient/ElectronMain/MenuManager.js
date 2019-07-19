const {
    app, 
    Menu, 
    BrowserWindow, 
    webContents,
    ipcMain
} = require('electron');

class MenuManagerControl {
    constructor() {
        this.menuOpenPreferences = null;
    }

    getGlobalMenuOption () {
        return [{
          label: app.getName(),
          submenu: [{
            label: "关于 " + app.getName(),
            role: "about"
          }, {
            label: "偏好设置",
            click: this.menuOpenPreferences
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
}

let MenuManager = new MenuManagerControl();

// export default MenuManager;
module.exports = MenuManager;
