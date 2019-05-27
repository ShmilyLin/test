const {
    ipcRenderer,
    remote
} = require('electron');

var vm = new Vue({
    el: '#app',
    data() {
        return {
            platform: "", // 平台
            isMaximize: false, // 是否最大化
            mode: 0, // 编辑模式，0为工具栏置顶，1为工具栏悬浮

            autoSave: false, // 是否自动保存

            dayList: [],
        }
    },
    computed: {
        headerStyle: function () {
            var tempStyle = "";
            if (this.mode === 1) {
                tempStyle += "border-bottom: 1px solid lightgray;";
            }

            if (this.platform === 'mac') {
                tempStyle += "-webkit-app-region: drag;";
            }

            return tempStyle;
        }
    },
    created: function() {
        console.log("【Plan】 created", process);
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

        if (remote.getGlobal('needOpenFile')) {

        }else {
            this.dayList.push({
                title: "第一天",
                subtitle: "",
                descContent: "",
                descList: [],

                timestamp: (new Date()).getTime(),
                
                isSelected: false,
                inputTitle: false,
                inputSubtitle: false,
                inputDesc: false,

                plans: [{
                    name: "计划1",
                    timestamp: (new Date()).getTime(),
                    inputName: false,
                    list: [{
                        /**
                         * 计划类型
                         * 
                         * 0 - 起点（包括起点名称，当天历经地点）
                         * 1 - 交通（交通方式、班次（可选交通卡）、花费、历时、起始时间、到达时间、备选）
                         * 2 - 住宿（住宿类型、住宿（酒店卡）、备选（酒店卡））
                         * 3 - 餐饮（餐饮类型、餐厅（餐厅卡）、备选）
                         * 4 - 景点（景点（景点卡）、花费、历时、开始时间、结束时间）
                         * 5 - 说明
                         * 6 - 图片
                         * 7 - 清单
                         */
                        type: 0, //
                        timestamp: (new Date()).getTime(),
                    }]
                }]
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

        /**
         * 副标题的聚焦事件
         */
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
            
        },

        /**
         * 说明的聚焦事件
         */
        dayItemDescItemFocusEvent: function (dayIndex, dayDescIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.descList[dayDescIndex].inputDesc = true;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },

        /**
         * 说明的失焦事件
         */
        dayItemDescItemBlurEvent: function ($event, dayIndex, dayDescIndex) {
            var tempDayItem = this.dayList[dayIndex];
            var tempContent = event.target.innerText;
            if (!tempContent || tempContent.length <= 0) {
                tempDayItem.descList.splice(dayDescIndex, 1);
                this.$set(this.dayList, dayIndex, tempDayItem);
            }else {
                tempDayItem.descList[dayDescIndex].content = tempContent;
                tempDayItem.descList[dayDescIndex].inputDesc = false;
                this.$set(this.dayList, dayIndex, tempDayItem);

                event.target.blur();
            }
        },

        /**
         * 新建说明的聚焦事件
         */
        dayItemDescContentFocusEvent: function (dayIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.inputDesc = true;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },

        /**
         * 新建说明的失焦事件
         */
        dayItemDescContentBlurEvent: function ($event, dayIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.inputDesc = false;
            this.$set(this.dayList, dayIndex, tempDayItem);
            var tempContent = event.target.innerText;
            if (tempContent && tempContent.length > 0) {
                var tempIndex = tempDayItem.descList.length;
                tempDayItem.descList.push({
                    content: tempContent,
                    inputDesc: false,
                    timestamp: (new Date()).getTime(),
                })

                this.$set(this.dayList, dayIndex, tempDayItem);

                event.target.innerText = "";

                setTimeout(() => {
                    this.$refs['day-item-desc-input-' + tempIndex][0].innerText = tempContent;
                });
            }
        },

        dayItemDescContentEnterEvent: function ($event, dayIndex) {
            var tempDayItem = this.dayList[dayIndex];
            var tempContent = event.target.innerText;
            if (tempContent && tempContent.length > 0) {
                var tempIndex = tempDayItem.descList.length;
                tempDayItem.descList.push({
                    content: tempContent,
                    inputDesc: false,
                    timestamp: (new Date()).getTime(),
                })

                this.$set(this.dayList, dayIndex, tempDayItem);

                event.target.innerText = "";

                setTimeout(() => {
                    this.$refs['day-item-desc-input-' + tempIndex][0].innerText = tempContent;
                });
            }
        },

        /**
         * 计划的名称的聚焦事件
         */
        planItemNameFocusEvent: function (dayIndex, planIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.plans[planIndex].inputName = true;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },

        /**
         * 计划的名称的失焦事件
         */
        planItemNameBlurEvent: function ($event, dayIndex, planIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.plans[planIndex].inputName = false;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },
    },
})