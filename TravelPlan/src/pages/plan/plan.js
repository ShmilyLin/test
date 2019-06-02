const {
    ipcRenderer,
    remote
} = require('electron');
const path = require('path');
const nedb = require('nedb');

const DayModel = require('../../models/DayModel.js');
const HotelCardModel = require('../../models/HotelCardModel.js');

console.log(path.join(remote.app.getPath('userData'), 'data/resource.db'));
const HotelCardDB = new nedb({
    filename: path.join(remote.app.getPath('userData'), 'data/hotelcard.db'),
    autoload: true, // 当数据存储被创建时，数据将自动从文件中加载到内存，不必去调用loadDatabase。注意所有命令操作只有在数据加载完成后才会被执行。
    corruptAlertThreshold: 0, // 默认10%,取值在0-1之间。如果数据文件损坏率超过这个百分比，NeDB将不会启动。取0，意味着不能容忍任何数据损坏；取1，意味着忽略数据损坏问题。
});

var vm = new Vue({
    el: '#app',
    data() {
        return {
            platform: "", // 平台
            isMaximize: false, // 是否最大化
            isShowCoverView: false, // 是否显示顶层遮盖
            mode: 0, // 编辑模式，0为工具栏置顶，1为工具栏悬浮
            isShowRight: false, // 是否显示右边栏
            isAutoShowRight: false, // 是否是自动显示隐藏右边栏
            rightInfo: null, // 右边栏样式

            autoSave: false, // 是否自动保存

            planInfo: {
                name: "",
                inputName: false,
                desc: "",
                inputDesc: false,
                numberOfPeople: 1, // 参与人数
                participants: [], // 参与人员
                participantsShowList: {}, // 显示的参与人员（成年人、儿童、老人、特殊照顾）
                expectedParticipants: [], // 预计参与人员
                expectedParticipantsShowList: {}, // 显示的预计参与人员（成年人、儿童、老人、特殊照顾）
                startDate: 0, // 出发日期
                startDateShow: "", // 
                numberOfDays: 1, // 历时天数
                endDate: 0, // 结束日期
                endDateShow: "" // 
                
            },
            dayList: [],
            currentSelected: {
                dayIndex: -1,
                planIndex: -1,
                planListItemIndex: -1,
            },

            hotelCardList: [],

            isTouchedACard: false,
            movingCard: {
                type: 0,
                data: null,
                x: 0,
                y: 0,
            }
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
            var tempModel = new DayModel();
            var tempPlan = tempModel.createAPlan("计划1");
            tempPlan.createAListItem(0)
            console.log(tempModel);

            this.dayList.push(tempModel);
        }

        ipcRenderer.on('child-window-closed', () => {
            this.isShowCoverView = false;
        })

        HotelCardDB.find({}, (err, docs) => {
            console.log("HotelCardDB find all", err, docs);
            if (err) {

            }else {
                for (var i = 0; i < docs.length; i++) {
                    docs[i].isShowRooms = false;
                    if (docs[i].rooms) {
                        for (var j = 0; j < docs[i].rooms.length; j++) {
                            docs[i].rooms[j].isShow = false;
                        }
                    }
                }
                
                this.hotelCardList = docs;
            }
        })
        
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
            console.log("appClickEvent");
            this.cancelSelectedItem(-1, -1, -1);
            this.rightInfo = null;
            // for (var i = 0; i < this.dayList.length; i++) {
            //     var tempDayItem = this.dayList[i];
            //     if (tempDayItem.isSelected) {
            //         tempDayItem.isSelected = false;
            //         this.$set(this.dayList, i, tempDayItem);
            //     }
            // }
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
            console.log("dayItemSelectedEvent", dayIndex);
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.isSelected = true;
            this.$set(this.dayList, dayIndex, tempDayItem);
            this.cancelSelectedItem(dayIndex, -1, -1);
            this.rightInfo = null;
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

        /**
         * 获取当天的旅游路线
         */
        getDayPlanPath: function (dayIndex, planIndex) {
            var tempContentList = [];
            var tempDayItem = this.dayList[dayIndex];
            var tempPlanItem = tempDayItem.plans[planIndex];
            for (var i = 0; i < tempPlanItem.list.length; i++) {
                if (tempPlanItem.list[i].type === 0) {
                    tempContentList.push({
                        content: tempPlanItem.list[i].pointName,
                        id: tempPlanItem.list[i].timestamp
                    });
                }
            }

            return tempContentList;
        },

        /**
         * 创建一个新的计划项
         */ 
        createAPlanListItem: function (dayIndex, planIndex, type) {
            console.log("createAPlanListItem", dayIndex, planIndex, type);
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListIndex = tempPlanItem.list.length;
            var tempPlanListItem = tempPlanItem.createAListItem(type);
            tempPlanListItem.isEditor = true;
            this.$set(this.dayList, dayIndex, tempDayItem);

            this.cancelSelectedItem(dayIndex, planIndex, tempPlanListIndex);
            
            console.log(tempPlanListItem);

            switch (type) {
                case 0:
                    this.rightInfo = null;
                    break;
                case 1:
                    this.rightInfo = {
                        type: 1,
                        
                    }
                    break;
                case 2:
                    this.rightInfo = {
                        type: 2,
                        isShowFilter: false,
                        isSearching: false,
                        isInputSearch: false,
                        searchContent: "",
                    }
                    break;
                case 5:
                    setTimeout(() => {
                        this.$refs['day-plan-list-item-text-input-' + tempPlanListIndex][0].focus();
                    });
                    break;
            }
        },

        /**
         * 点击一个计划项
         */
        dayPlanListItemClickEvent: function (event, dayIndex, planIndex, planListIndex) {
            var tempDayItem = this.dayList[dayIndex];
            var tempPlanItem = tempDayItem.plans[planIndex];
            var tempPlanListItem = tempPlanItem.list[planListIndex];

            if (tempPlanListItem.type === 2) { // 住宿
                tempDayItem.isSelected = true;
                tempPlanItem.isSelected = true;
                tempPlanListItem.isEditor = true;
                this.$set(this.dayList, dayIndex, tempDayItem);
                this.cancelSelectedItem(dayIndex, planIndex, planListIndex);
                this.rightInfo = {
                    type: 2,
                    isShowFilter: false,
                    isSearching: false,
                    isInputSearch: false,
                    searchContent: "",
                }
                event.stopPropagation();
            }
        },

        /**
         * 天 > 计划 > 项-起点 > 输入框聚焦事件
         */
        planListItemPointNameFocusEvent(dayIndex, planIndex, planListIndex) {
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[planListIndex];
            tempPlanListItem.isEditor = true;
            tempPlanListItem.inputPointName = true;
            this.$set(this.dayList, dayIndex, tempDayItem);

            this.cancelSelectedItem(dayIndex, planIndex, planListIndex);
        },

        /**
         * 天 > 计划 > 项-文字 > 输入框聚焦事件
         */
        dayPlanListItemTextFocusEvent: function (dayIndex, planIndex, planListIndex) {
            console.log("dayPlanListItemTextFocusEvent", dayIndex, planIndex, planListIndex);
            var tempDayItem = this.dayList[dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[planListIndex];
            tempPlanListItem.isEditor = true;
            tempPlanListItem.inputContent = true;
            this.$set(this.dayList, dayIndex, tempDayItem);

            this.cancelSelectedItem(dayIndex, planIndex, planListIndex);
        },
        
        /**
         * 天 > 计划 > 项-文字 > 输入框失焦事件
         */
        dayPlanListItemTextBlurEvent: function (event, dayIndex, planIndex, planListIndex) {
            var tempDayItem = this.dayList[dayIndex];
            var tempPlanItem = tempDayItem.plans[planIndex];
            var tempPlanListItem = tempPlanItem.list[planListIndex];
            tempPlanListItem.inputContent = false;
            tempPlanListItem.content = event.target.innerText;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },

        /**
         * 天 > 计划 > 项-住宿 > 点击选择房型
         */
        planListItemHotelAddRoomButtonClickEvent(dayIndex, planIndex, planListIndex) {
            var tempDayItem = this.dayList[dayIndex];
            var tempPlanItem = tempDayItem.plans[planIndex];
            var tempPlanListItem = tempPlanItem.list[planListIndex];
            tempPlanListItem.isShowAddRoom = true;
            this.$set(this.dayList, dayIndex, tempDayItem);
        },

        /**
         * 右边栏 > 顶部 > 固定按钮点击事件
         */
        sectionRightHeaderActionAutoShowButtonClick: function () {
            this.isAutoShowRight = !this.isAutoShowRight;
        },

        /**
         * 旅行计划名字的聚焦事件
         */
        planInfoNameFocusEvent: function () {
            this.planInfo.inputName = true;
        },

        /**
         * 旅行计划名字的失焦事件
         */
        planInfoNameBlurEvent: function (event) {
            this.planInfo.inputName = false;
            this.planInfo.name = event.target.innerText;
        },

        /**
         * 旅行计划名字的换行事件
         */
        planInfoNameEnterEvent: function (event) {
            this.planInfo.inputName = false;
            this.planInfo.name = event.target.innerText;
            event.target.blur();
        },

        /**
         * 旅行计划简介的聚焦事件
         */
        planInfoDescFocusEvent: function () {
            this.planInfo.inputDesc= true;
        },
        
        planInfoDescBlurEvent: function (event) {
            this.planInfo.inputDesc = false;
            this.planInfo.desc = event.target.innerText;
        },

        /**
         * 取消选中状态
         */
        cancelSelectedItem: function (tempNewDayIndex, tempNewPlanIndex, tempNewPlanListItemIndex) {
            var tempDayIndex = this.currentSelected.dayIndex;
            var tempPlanIndex = this.currentSelected.planIndex;
            var tempPlanListItemIndex = this.currentSelected.planListItemIndex;

            if (tempDayIndex >= 0 && this.dayList[tempDayIndex]) {
                var tempDayItem = this.dayList[tempDayIndex];
                if (tempNewDayIndex != tempDayIndex) {
                    tempDayItem.isSelected = false;
                }
                
                if (tempPlanIndex >= 0 && tempDayItem.plans[tempPlanIndex]) {
                    var tempPlanItem = tempDayItem.plans[tempPlanIndex];
                    if (tempNewPlanIndex != tempPlanIndex || tempNewDayIndex != tempDayIndex) {
                        tempPlanItem.isSelected = false;
                    }
                    
                    if (tempPlanListItemIndex >= 0 && tempPlanItem.list[tempPlanListItemIndex]) {
                        if (tempNewPlanListItemIndex != tempPlanListItemIndex || tempNewPlanIndex != tempPlanIndex || tempNewDayIndex != tempDayIndex) {
                            var tempPlanListItem = tempPlanItem.list[tempPlanListItemIndex];
                            tempPlanListItem.isEditor = false;
                        }
                    }
                }

                this.$set(this.dayList, tempDayIndex, tempDayItem);
            }

            this.currentSelected.dayIndex = tempNewDayIndex;
            this.currentSelected.planIndex = tempNewPlanIndex;
            this.currentSelected.planListItemIndex = tempNewPlanListItemIndex;
        },

        

        /**
         * 右边栏 > 住宿卡 > 新建一个住宿卡
         */
        sectionRightHotelHeaderAddButtonClickEvent: function () {
            this.isShowCoverView = true;
            ipcRenderer.send('create-hotel-card');
        },

        /**
         * 右边栏 > 住宿卡 > 点击一个住宿卡
         */
        sectionRightHotelItemMousedownEvent: function (event, hotelCardIndex) {
            var tempHotelCardItem = this.hotelCardList[hotelCardIndex];
            this.movingCard.type = 2;
            this.movingCard.content = "住宿：" + tempHotelCardItem.name;
            this.movingCard.data = tempHotelCardItem;
            this.movingCard.x = event.x;
            this.movingCard.y = event.y;
            this.isTouchedACard = true;
        },

        movingCardCoverViewMousemoveEvent: function (event) {
            if (this.isTouchedACard) {
                this.movingCard.x = event.x;
                this.movingCard.y = event.y;
                // var eles = document.elementsFromPoint(event.x,event.y);
            }
        },

        movingCardCoverViewMouseupEvent: function (event) {
            if (this.isTouchedACard) {
                console.log("movingCardCoverViewMouseupEvent", event, this.$refs);
                this.isTouchedACard = false;
                var tempSectionDom = this.$refs["section"];
                var tempSectionDomRect = tempSectionDom.getBoundingClientRect();
                if (event.x >= tempSectionDomRect.left && event.x <= (tempSectionDomRect.left + tempSectionDomRect.width) && event.y >= tempSectionDomRect.top && event.y <= (tempSectionDomRect.top + tempSectionDomRect.height)) {
                    var tempDayList = this.dayList;
                    for (var i = 0; i < tempDayList.length; i++) {
                        var tempDayDom = this.$refs['section-canvas-day-' + i][0];
                        console.log("tempDayDom", tempDayDom);
                        var tempDayDomRect = tempDayDom.getBoundingClientRect();
                        if (event.x >= tempDayDomRect.left && event.x <= (tempDayDomRect.left + tempDayDomRect.width) && event.y >= tempDayDomRect.top && event.y <= (tempDayDomRect.top + tempDayDomRect.height)) {
                            var tempDayItem = tempDayList[i];
                            if (tempDayItem.plans && tempDayItem.plans.length > 0) {
                                for (var j = 0; j < tempDayItem.plans.length; j++) {
                                    var tempPlanDom = this.$refs['section-canvas-day-plan-' + i + '-' + j][0];
                                    console.log("tempPlanDom", tempPlanDom);
                                    var tempPlanDomRect = tempPlanDom.getBoundingClientRect();
                                    if (event.x >= tempPlanDomRect.left && event.x <= (tempPlanDomRect.left + tempPlanDomRect.width) && event.y >= tempPlanDomRect.top && event.y <= (tempPlanDomRect.top + tempPlanDomRect.height)) {
                                        var tempPlanItem = tempDayItem.plans[j];
                                        if (tempPlanItem.list && tempPlanItem.list.length > 0) {
                                            var tempFind = false;
                                            for (var n = 0; n < tempPlanItem.list.length; n++) {
                                                var tempPlanListItem = tempPlanItem.list[n];
                                                if (tempPlanListItem.type === this.movingCard.type) {
                                                    switch (this.movingCard.type) {
                                                        case 2:
                                                            // if (tempPlanListItem.hotal && tempPlanListItem.hotal.defaultHotel) {

                                                            // }else {
                                                                // 没有默认的住宿卡
                                                                var tempDefaultHotelDom = this.$refs['day-plan-list-item-hotel-default-' + i + '-' + j + '-' + n][0];
                                                                console.log("tempDefaultHotelDom", tempDefaultHotelDom);
                                                                var tempDefaultHotelDomRect = tempDefaultHotelDom.getBoundingClientRect();
                                                                if (event.x >= tempDefaultHotelDomRect.left && event.x <= (tempDefaultHotelDomRect.left + tempDefaultHotelDomRect.width) && event.y >= tempDefaultHotelDomRect.top && event.y <= (tempDefaultHotelDomRect.top + tempDefaultHotelDomRect.height)) {
                                                                    var tempMovingData = JSON.parse(JSON.stringify(this.movingCard.data));
                                                                    console.log("tempMovingData", tempMovingData);
                                                                    tempMovingData.isShowAddRoom = false;
                                                                    tempPlanListItem.hotal.defaultHotel = tempMovingData;
                                                                    this.$set(this.dayList, i, tempDayItem);
                                                                    tempFind = true;
                                                                }
                                                            // }
                                                            break;
                                                    }
                                                }

                                                if (tempFind) {
                                                    break;
                                                }
                                            }
                                        }

                                        break;
                                    }
                                }
                            }
                            
                            break;
                        }
                    }
                }
                this.movingCard.type = 0;
                this.movingCard.content = "";
                this.movingCard.data = null;
                this.movingCard.x = event.x;
                this.movingCard.y = event.y;
                
            }
        },

        /**
         * 右边栏 > 住宿卡 > 点击显示一个住宿卡的所有房型
         */
        sectionRightHotelCardItemShowButtonClickEvent: function (hotelCardIndex) {
            var tempHotelItem = this.hotelCardList[hotelCardIndex];
            tempHotelItem.isShowRooms = !tempHotelItem.isShowRooms;
            this.$set(this.hotelCardList, hotelCardIndex, tempHotelItem);
        },

        /**
         * 右边栏 > 住宿卡 > 点击显示一个房型的详细信息
         */
        sectionRightHotelCardItemRoomItemShowButtonClickEvent: function (hotelCardIndex, roomIndex) {
            var tempHotelItem = this.hotelCardList[hotelCardIndex];
            var tempRoomItem = tempHotelItem.rooms[roomIndex];
            tempRoomItem.isShow = !tempRoomItem.isShow;
            this.$set(this.hotelCardList, hotelCardIndex, tempHotelItem);
        },

        getHotelCardRoomItemNumberOfPeopleAvailable: function (roomItem) {
            var tempStr = roomItem.numberOfPeopleAvailable.adult + "名成年人";
            if (roomItem.numberOfPeopleAvailable.child > 0) {
                tempStr += ", " + roomItem.numberOfPeopleAvailable.child + "名儿童";
            }else {

            }
        }
    },
})