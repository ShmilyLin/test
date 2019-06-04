<template>
    <div class="footer">
        <div class="footer-left" @click="createAPlanButtonClickEvent">新建旅行计划</div>
        <div class="footer-right">打开旅行计划</div>
    </div>
</template>

<script>
const {
    ipcRenderer,
    remote
} = window.require('electron');

export default {
	name: 'Footer',
	methods: {
		createAPlanButtonClickEvent: function () {
            var currentWindow = remote.getCurrentWindow();

            if (window.process.env.runtype === 'dev') {
                currentWindow.loadURL('http://localhost:8080/plan.html');
            }else {
                currentWindow.loadFile('dist/plan.html');
            }
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../../../utils/GlobalScss.scss";

.footer {
    margin: 0 20px;
    padding: 20px 0;
    height: 30px;
    border-top: 1px solid lightgray;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.footer-left {
    @include main-button;
    // width: 120px;
    // text-align: center;
    // font-size: 14px;
    // line-height: 30px;
    // border-radius: 4px;
    // background-color: #FF6F61;
    // cursor: pointer;
    // color: white;
}

// .footer-left:hover {
//     background-color: #E94B3C;
// }

.footer-right {
    @include secondary-button;

    margin-left: 20px;
    // width: 120px;
    // text-align: center;
    // font-size: 14px;
    // line-height: 28px;
    // border-radius: 4px;
    // border: 1px solid #FF6F61;
    // cursor: pointer;
}

// .footer-right:hover {
//     background-color: #E94B3C;
//     border: 1px solid #E94B3C;
//     color: white;
// }
</style>
