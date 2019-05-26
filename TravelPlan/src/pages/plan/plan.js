const {
    ipcRenderer,
    remote
} = require('electron');

var vm = new Vue({
    el: '#app',
    data() {
        return {
            platform: "", // 平台
            mode: 0, // 编辑模式，0为工具栏置顶，1为工具栏悬浮

            autoSave: false, // 是否自动保存

            dayList: [],
        }
    },
    created: function() {
        console.log("【Plan】 created", process);
        if (process.platform === "darwin") {
            this.platform = "mac";
        }

        if (remote.getGlobal('needOpenFile')) {

        }else {
            this.dayList.push({
                title: "第一天",
                subtitle: "",

                timestamp: (new Date()).getTime(),
                
                isSelected: false,
                inputTitle: false,
                inputSubtitle: false,
            });
        }
    },
    mounted: function() {
        console.log(this.$refs);
        for (var i = 0; i < this.dayList.length; i++) {
            this.$refs["day-item-title-input-" + i][0].innerText = this.dayList[i].title;
            this.$refs["day-item-subtitle-input-" + i][0].innerText = this.dayList[i].subtitle;
        }
    },
    methods: {
        appClickEvent: function () {
            for (var i = 0; i < this.dayList.length; i++) {
                var tempDayItem = this.dayList[i];
                if (tempDayItem.isSelected) {
                    tempDayItem.isSelected = false;
                    this.$set(this.dayList, i, tempDayItem);
                }
            }
        },
        /*
         * 点击自动保存按钮
         */
        autoSaveSwitchButtonClickEvent: function () {
            this.autoSave = !this.autoSave;
        },

        /**
         * 点击切换工具栏模式
         */
        headerActionItemChangeModeButtonClickEvent: function () {
            if (this.mode === 0) {
                this.mode = 1;
            }else if (this.mode === 1) {
                this.mode = 0;
            }
        },

        /*
         * 选中一天
         */
        dayItemSelectedEvent: function (dayIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.isSelected = true;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },

        /**
         * 标题的聚焦事件
         */
        dayItemTitleFocusEvent: function (dayIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.inputTitle = true;

            for (var i = 0; i < this.dayList.length; i++) {
                if (i != dayIndex) {
                    var tempForDayItem = this.dayList[i];
                    if (tempForDayItem.isSelected) {
                        tempForDayItem.isSelected = false;
                        this.$set(this.dayList, i, tempForDayItem);
                    }
                }
            }

            tempDayItem.isSelected = true;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },

        /**
         * 标题的失焦事件
         */
        dayItemTitleBlurEvent: function (event, dayIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.inputTitle = false;
            tempDayItem.title = event.target.innerText;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },

        dayItemSubtitleFocusEvent: function (dayIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.inputSubtitle = true;

            for (var i = 0; i < this.dayList.length; i++) {
                if (i != dayIndex) {
                    var tempForDayItem = this.dayList[i];
                    if (tempForDayItem.isSelected) {
                        tempForDayItem.isSelected = false;
                        this.$set(this.dayList, i, tempForDayItem);
                    }
                }
            }

            tempDayItem.isSelected = true;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },

        /**
         * 副标题的失焦事件
         */
        dayItemSubtitleBlurEvent: function (event, dayIndex) {
            console.log(event.target.innerText);
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.inputSubtitle = false;
            tempDayItem.subtitle = event.target.innerText;
            this.$set(this.dayList, dayIndex, tempDayItem);
            
        }
    },
})