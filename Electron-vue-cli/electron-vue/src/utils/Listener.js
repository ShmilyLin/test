const {
    ipcRenderer,
    remote
} = window.require('electron');

const Keys = {
    HotelCardDBModified: "HotelCardDBModified",
}

function on(eventKey, callback) {
    ipcRenderer.on(eventKey, callback);
    ipcRenderer.send("ipc-renderer-listener-on", {
        id: remote.getCurrentWebContents().id,
        eventKey: eventKey
    });
}

function once(eventKey, callback) {
    ipcRenderer.once(eventKey, callback);
    ipcRenderer.send("ipc-renderer-listener-once", {
        id: remote.getCurrentWebContents().id,
        eventKey: eventKey
    });
}

function done(eventKey, params) {
    ipcRenderer.send("ipc-renderer-listener-done", {
        eventKey: eventKey,
        params: params
    });
}

function off(eventKey) {
    ipcRenderer.removeAllListeners(eventKey);
    ipcRenderer.send("ipc-renderer-listener-off", {
        id: remote.getCurrentWebContents().id,
        eventKey: eventKey
    });
}

export default {
    Keys,
    on,
    once,
    done,
    off
}