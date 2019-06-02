<template>
    <div class="header" :style="platform==='win' ? '' : '-webkit-app-region: drag;'">
        <div class="header-title">旅行计划</div>
        <div class="header-info">
            <div class="header-info-author">By Lin</div>
            <div class="header-info-version">v 1.0.0</div>
        </div>
        <div class="header-top" v-if="platform==='win'">
            <div class="header-trafficlight">
                <div class="header-trafficlight-close" @click="headerTrafficlightCloseButtonClickEvent">
                    <div class="header-trafficlight-close-box"></div>
                </div>
                <div class="header-trafficlight-minimize" @click="headerTrafficlightMinimizeButtonClickEvent">
                    <div class="header-trafficlight-minimize-box"></div>
                </div>
                <div class="header-trafficlight-maximize" @click="headerTrafficlightMaximizeButtonClickEvent">
                    <div :class="isMaximize ? 'header-trafficlight-unmaximize-box' : 'header-trafficlight-maximize-box'"></div>
                </div>
            </div>
            <div class="header-top-space"></div>
        </div>
    </div>
</template>

<script>
const {
    ipcRenderer,
    remote
} = window.require('electron');

export default {
    name: 'Header',
    data() {
        return {
			platform: "", // 平台
			
			isMaximize: false,// 是否最大化
        }
    },
    created: function () {
        if (window.process.platform === "darwin") {
            this.platform = "mac";
        }else if (window.process.platform.indexOf('win') >= 0) {
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
    }
}
</script>


<style lang="scss" scoped>
.header {
    width: calc(100% - 60px);
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    padding: 20px 30px;
    padding-top: 40px;
    background-color: #FF6F61;
}

.header-title {
    font-size: 40px;
    line-height: 1;
    color: white;
}

.header-info {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.header-info-author {
    font-size: 18px;
    line-height: 1;
    color: white;
}

.header-info-version {
    font-size: 12px;
    line-height: 1;
    margin-top: 4px;
    color: white;
}

.header-top {
    width: 100%;
    height: 24px;
    display: flex;
    flex-direction: row;
    position: fixed;
    left: 0;
    top: 0;
}

/* Windows专属，左上角红绿灯 */
.header-trafficlight {
    display: flex;
    flex-direction: row;
    -webkit-app-region: unset;
}

.header-trafficlight-close {
    width: 14px;
    height: 14px;
    padding: 5px 10px;
}

.header-trafficlight-close:hover {
    /* background-color: #FC615D; */
    background-color: red;
}

.header-trafficlight-close-box {
    width: 14px;
    height: 14px;
    background-image: url(../../../assets/win_close.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.header-trafficlight-minimize {
    width: 16px;
    height: 18px;
    padding: 3px 9px;
}

.header-trafficlight-minimize:hover {
    background-color: #FDBC40;
}

.header-trafficlight-minimize-box {
    width: 16px;
    height: 18px;
    background-image: url(../../../assets/win_minimize.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}


.header-trafficlight-maximize {
    width: 18px;
    height: 18px;
    padding: 3px 8px;
}

.header-trafficlight-maximize:hover {
    background-color: #34C749;
}

.header-trafficlight-maximize-box {
    width: 18px;
    height: 18px;
    background-image: url(../../../assets/win_maximize.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.header-trafficlight-unmaximize-box {
    width: 18px;
    height: 18px;
    background-image: url(../../../assets/win_unmaximize.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.header-top-space {
    width: calc(100% - (34px * 3));
    height: 100%;
    -webkit-app-region: drag;
}
</style>
