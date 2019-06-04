<template>
    <div class="top-menu" :style="headerStyle">
        <div class="tm-trafficlight" :style="{ width: platform === 'win' ? '102px' : '80px'}">
            <template v-if="platform === 'win'">
                <div class="tm-trafficlight-close" @click="headerTrafficlightCloseButtonClickEvent">
                    <div class="tm-trafficlight-close-box"></div>
                </div>
                <div class="tm-trafficlight-minimize" @click="headerTrafficlightMinimizeButtonClickEvent">
                    <div class="tm-trafficlight-minimize-box"></div>
                </div>
                <div class="tm-trafficlight-maximize" @click="headerTrafficlightMaximizeButtonClickEvent">
                    <div :class="isMaximize ? 'tm-trafficlight-unmaximize-box' : 'tm-trafficlight-maximize-box'"></div>
                </div>
            </template>
        </div>
        <div class="tm-autosave">
            <switch-button class="tm-autosave-switch" :is-switch="autoSave" @click.native="autoSaveSwitchButtonClickEvent"></switch-button>
            <div class="tm-autosave-text">{{autoSave ? '已打开自动保存' : '已关闭自动保存'}}</div>
        </div>
        <div class="tm-actions">
            <div class="tm-actions-save" title="保存"></div>
            <div class="tm-actions-mode" title="切换工具栏模式" @click="headerActionItemChangeModeButtonClickEvent"></div>
        </div>
        <div class="tm-space" v-if="platform === 'win'"></div>
    </div>
</template>

<script>
const {
    ipcRenderer,
    remote
} = window.require('electron');

import Global from '../utils/Global.js';

import SwitchButton from '../../../components/SwitchButton.vue';

export default {
    name: 'TopMenu',
    components: {
        SwitchButton,
    },
    props: {
        topToolMode: { // 工具栏显示模式，0为工具栏始终显示，1为工具栏鼠标悬停显示
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            platform: "", // 平台
        }
    },
    computed: {
        headerStyle: function () {
            var tempStyle = "";
            if (this.topToolMode === 1) {
                tempStyle += "border-bottom: 1px solid lightgray;";
            }

            if (this.platform === 'mac') {
                tempStyle += "-webkit-app-region: drag;";
            }

            return tempStyle;
        },
        autoSave: function () {
            return this.$store.state.autoSave;
        }
    },
    created: function () {
		if (window.process.platform === "darwin") {
            this.platform = "mac";
        }else if (window.process.platform.indexOf('win') >= 0) {
            this.platform = "win";
		}
	},
	methods: {
		// Windows专属，红路灯操作事件
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

        /*
         * 点击自动保存按钮
         */
        autoSaveSwitchButtonClickEvent: function () {
            this.$store.commit(Global.Store.MutationsKeys.SetAutoSave, !this.autoSave);
        },

        /**
         * 点击切换工具栏模式
         */
        headerActionItemChangeModeButtonClickEvent: function () {
            this.$emit('top-tool-mode');
        },
	}
}
</script>

<style lang="scss" scoped>
.top-menu {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: all 0.5 linear;
}

/* Windows */
.tm-trafficlight {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.tm-trafficlight-close {
    width: 14px;
    height: 14px;
    padding: 5px 10px;
}

.tm-trafficlight-close:hover {
    background-color: #FC615D;
}

.tm-trafficlight-close-box {
    width: 14px;
    height: 14px;
    background-image: url(../../../assets/win_close.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.tm-trafficlight-minimize {
    width: 16px;
    height: 18px;
    padding: 3px 9px;
}

.tm-trafficlight-minimize:hover {
    background-color: #FDBC40;
}

.tm-trafficlight-minimize-box {
    width: 16px;
    height: 18px;
    background-image: url(../../../assets/win_minimize.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}


.tm-trafficlight-maximize {
    width: 18px;
    height: 18px;
    padding: 3px 8px;
}

.tm-trafficlight-maximize:hover {
    background-color: #34C749;
}

.tm-trafficlight-maximize-box {
    width: 18px;
    height: 18px;
    background-image: url(../../../assets/win_maximize.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.tm-trafficlight-unmaximize-box {
    width: 18px;
    height: 18px;
    background-image: url(../../../assets/win_unmaximize.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}


.tm-autosave {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    margin-left: 20px;
}

.tm-autosave-text {
    margin-left: 5px;
    font-size: 12px;
    line-height: 1;
    color: #666666;
}

.tm-actions {
    margin-left: 10px;
    border-left: 1px solid lightgray;
    padding-left: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 24px;
}

.tm-actions-save {
    width: 24px;
    height: 24px;
    background-image: url(../assets/plan_save.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
}

.tm-actions-save:hover {
    background-image: url(../assets/plan_save_hover.png);
}

.tm-actions-mode {
    width: 18px;
    height: 18px;
    padding: 3px;
    background-image: url(../assets/plan_mode.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    margin-left: 10px;
    background-origin: content-box;
}

.tm-actions-mode:hover {
    background-image: url(../assets/plan_mode_hover.png);
}


.tm-space {
    width: calc(100% - (34px * 3) - 20px - 32px - 5px - 90px - 10px - 1px - 10px - 24px - 10px - 24px - 10px);
    height: 100%;
    -webkit-app-region: drag;
}
</style>