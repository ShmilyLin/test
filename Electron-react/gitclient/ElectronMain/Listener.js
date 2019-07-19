const {
    app, 
    Menu, 
    BrowserWindow, 
    webContents,
    ipcMain
} = require('electron');

class ListenerManager {
    constructor() {
        this.RenderListener = {};
          
          ipcMain.on('ipc-renderer-listener-on', (event, arg) => {
            console.log("ipc-renderer-listener-on", event, arg);
            if (!this.RenderListener[arg.eventKey]) {
                this.RenderListener[arg.eventKey] = [arg.id];
            }else {
                if (this.RenderListener[arg.eventKey].indexOf(arg.id) < 0) {
                    this.RenderListener[arg.eventKey].push(arg.id);
                }
            }
          
            console.log("ipc-renderer-listener-on", this.RenderListener);
          })
          
          ipcMain.on('ipc-renderer-listener-once', (event, arg) => {
            console.log("ipc-renderer-listener-once", event, arg);
            if (!this.RenderListener[arg.eventKey + '_once']) {
                this.RenderListener[arg.eventKey + '_once'] = [arg.id];
            }else {
              if (this.RenderListener[arg.eventKey + '_once'].indexOf(arg.id) < 0) {
                this.RenderListener[arg.eventKey + '_once'].push(arg.id);
              }
            }
          
            console.log("ipc-renderer-listener-once", this.RenderListener);
          })
          
          ipcMain.on('ipc-renderer-listener-done', (event, arg) => {
            console.log("ipc-renderer-listener-done", event, arg);
            var tempIDList = this.RenderListener[arg.eventKey];
            var tempOnceIDList = this.RenderListener[arg.eventKey + '_once'];
            this.RenderListener[arg.eventKey + '_once'] = [];
          
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
          
            console.log("ipc-renderer-listener-done", this.RenderListener);
          })
          
          ipcMain.on('ipc-renderer-listener-off', (event, arg) => {
            console.log("ipc-renderer-listener-off", event, arg);
            var tempIDList = this.RenderListener[arg.eventKey];
            if (tempIDList && tempIDList.length > 0) {
              for (var i = 0; i < tempIDList.length; i++) {
                this.RenderListener[arg.eventKey].splice(i, 1);
                  break;
              }
            }
          
            var tempOnceIDList = this.RenderListener[arg.eventKey + '_once'];
            if (tempOnceIDList && tempOnceIDList.length > 0) {
              for (var i = 0; i < tempOnceIDList.length; i++) {
                this.RenderListener[arg.eventKey + '_once'].splice(i, 1);
                  break;
              }
            }
          
            console.log("ipc-renderer-listener-off", this.RenderListener);
          })
    }
}

let Listener = new ListenerManager();

module.exports = Listener;
