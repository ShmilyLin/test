const {
    ipcRenderer,
    remote
} = require('electron');

var vm = new Vue({
    el: '#app',
    data() {
        return {
            platform: "", // 平台
            isMaximize: false,// 是否最大化

            fileList: [],
        }
    },
    created: function () {
        console.log(process);
        if (process.platform === "darwin") {
            this.platform = "mac";
        }else if (process.platform.indexOf('win') >= 0) {
            this.platform = "win";
        }

        var currentWindow = remote.getCurrentWindow();
        currentWindow.on("maximize", () => {
            this.isMaximize = true;
        })

        currentWindow.on("unmaximize", () => {
            this.isMaximize = false;
        })
    },
    mounted: function () {
        
    },
    methods: {
        // Windows专属
        headerTrafficlightCloseButtonClickEvent: function () {
            var currentWindow = remote.getCurrentWindow();
            if (currentWindow.isClosable()) {
                currentWindow.close();
            }
        },

        headerTrafficlightMinimizeButtonClickEvent: function () {
            var currentWindow = remote.getCurrentWindow();
            if (currentWindow.isMinimizable()) {
                currentWindow.minimize();
            }
        },

        headerTrafficlightMaximizeButtonClickEvent: function () {
            var currentWindow = remote.getCurrentWindow();
            if (currentWindow.isMaximized()) {
                currentWindow.unmaximize();
            }else {
                if (currentWindow.isMaximizable()) {
                    currentWindow.maximize();
                }
            }
        },

        createAPlanButtonClickEvent: function () {
            var currentWindow = remote.getCurrentWindow();
            currentWindow.loadFile('./src/pages/plan/index.html');
        }
    },
})