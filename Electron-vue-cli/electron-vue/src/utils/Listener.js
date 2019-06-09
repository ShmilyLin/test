const {
    ipcRenderer,
    remote
} = window.require('electron');

const Keys = {
    HotelCardDBModified: "HotelCardDBModified",
}

function on(eventKey, callback) {
    var RenderListener = {};
    if (sessionStorage.getItem("RenderListener")) {
        RenderListener = JSON.parse(sessionStorage.getItem("RenderListener"));
    }

    if (!RenderListener[eventKey]) {
        RenderListener[eventKey] = [remote.getCurrentWebContents().id];
        sessionStorage.setItem("RenderListener", JSON.stringify(RenderListener));
    }else {
        if (RenderListener[eventKey].indexOf(remote.getCurrentWebContents().id) < 0) {
            RenderListener[eventKey].push(remote.getCurrentWebContents().id);
            sessionStorage.setItem("RenderListener", JSON.stringify(RenderListener));
        }
    }

    ipcRenderer.on(eventKey, callback);
}

function once(eventKey, callback) {
    var RenderListener = {};
    if (sessionStorage.getItem("RenderListener")) {
        RenderListener = JSON.parse(sessionStorage.getItem("RenderListener"));
    }

    if (!RenderListener[eventKey]) {
        RenderListener[eventKey + '_once'] = [remote.getCurrentWebContents().id];
        sessionStorage.setItem("RenderListener", JSON.stringify(RenderListener));
    }else {
        if (RenderListener[eventKey + '_once'].indexOf(remote.getCurrentWebContents().id) < 0) {
            RenderListener[eventKey + '_once'].push(remote.getCurrentWebContents().id);
            sessionStorage.setItem("RenderListener", JSON.stringify(RenderListener));
        }
    }

    ipcRenderer.once(eventKey, callback);
}

function done(eventKey, params) {
    var RenderListener = {};
    if (sessionStorage.getItem("RenderListener")) {
        RenderListener = JSON.parse(sessionStorage.getItem("RenderListener"));
    }

    var tempIDList = RenderListener[eventKey];
    var tempOnceIDList = RenderListener[eventKey + '_once'];
    RenderListener[eventKey + '_once'] = [];
    sessionStorage.setItem("RenderListener", JSON.stringify(RenderListener));

    if (tempOnceIDList && tempOnceIDList.length > 0) {
        tempIDList = tempIDList.concat(tempOnceIDList);
    }

    if (tempIDList && tempIDList.length > 0) {
        for (var i = 0; i < tempIDList.length; i++) {
            var tempWebContents = remote.webContents.fromId(tempIDList[i]);
            if (tempWebContents) {
                tempWebContents.send(eventKey, params);
            }
        }
    }
}

function off(eventKey) {
    var RenderListener = {};
    if (sessionStorage.getItem("RenderListener")) {
        RenderListener = JSON.parse(sessionStorage.getItem("RenderListener"));
    }

    var tempIDList = RenderListener[eventKey];
    if (tempIDList && tempIDList.length > 0) {
        for (var i = 0; i < tempIDList.length; i++) {
            RenderListener[eventKey].splice(i, 1);
            break;
        }
    }
    
    var tempOnceIDList = RenderListener[eventKey + '_once'];
    if (tempOnceIDList && tempOnceIDList.length > 0) {
        for (var i = 0; i < tempOnceIDList.length; i++) {
            RenderListener[eventKey + '_once'].splice(i, 1);
            break;
        }
    }

    sessionStorage.setItem("RenderListener", JSON.stringify(RenderListener));

    ipcRenderer.removeAllListeners(eventKey);
}

export default {
    Keys,
    on,
    once,
    done,
    off
}