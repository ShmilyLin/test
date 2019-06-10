<template>
    <div class="right-sidebar" 
		@click.stop 
		@mousedown.stop 
		@mousemove.stop 
		@mouseup.stop>
        <div class="rs-header">
			<div class="rs-header-title">右边栏</div>
			<div class="rs-header-actions">
				<div :class="isAutoShowRight ? 'rs-header-actions-autoshow' : 'rs-header-actions-show'" :title="isAutoShowRight ? '当前为自动显示右边栏' : '当前为始终显示右边栏'" @click="sectionRightHeaderActionAutoShowButtonClick"></div>
			</div>
		</div>
		<div class="rs-content">
			<!-- 无 -->
			<template v-if="!rightInfo">
				<div class="rs-content-info">
					<div class="rs-content-info-name" :class="{ 'rs-content-info-name-focus': planInfoEdit.inputName }">
						<div class="rs-content-info-name-placeholder" v-if="!planInfoEdit.inputName && (!planInfoEdit.name || planInfoEdit.name.length <= 0)">请输入旅行计划的名字</div>
						<div class="rs-content-info-name-text" 
							contenteditable="plaintext-only" 
							ref="rs-content-info-name"
							@mousedown.stop 
							@focus="planInfoNameFocusEvent()" 
							@blur="planInfoNameBlurEvent($event)" 
							@keydown.enter.prevent="planInfoNameEnterEvent($event)"></div>
					</div>
					<div class="rs-content-info-desc" :class="{ 'rs-content-info-desc-focus': planInfoEdit.inputDesc }">
						<div class="rs-content-info-desc-placeholder" v-if="!planInfoEdit.inputDesc && (!planInfoEdit.desc || planInfoEdit.desc.length <= 0)">旅行计划的简介</div>
						<div class="rs-content-info-desc-text" 
							contenteditable="plaintext-only" 
							ref="rs-content-info-desc"
							@mousedown.stop 
							@focus="planInfoDescFocusEvent()" 
							@blur="planInfoDescBlurEvent($event)"></div>
					</div>
					<div class="rs-content-info-line"></div>
					<div class="rs-content-info-count">
						<div class="rs-content-info-count-title">天数</div>
						<div class="rs-content-info-count-content">
							<div class="rs-content-info-count-content-num">{{planInfoEdit.numberOfDays}}</div>
							<div class="rs-content-info-count-content-actions">
								<div class="rs-content-info-count-content-actions-less">-</div>
								<div class="rs-content-info-count-content-actions-plus">+</div>
							</div>
						</div>
					</div>
					<div class="rs-content-info-date">
						<div class="rs-content-info-date-title">开始时间</div>
						<div class="rs-content-info-date-content">
							<div class="rs-content-info-date-content-show">{{planInfoEdit.startDateShow}}</div>
							<div class="rs-content-info-date-content-choose">

							</div>
						</div>
					</div>
					<div class="rs-content-info-date">
						<div class="rs-content-info-date-title">结束时间</div>
						<div class="rs-content-info-date-content">
							<div class="rs-content-info-date-content-show">{{planInfoEdit.endDateShow}}</div>
							<div class="rs-content-info-date-content-choose">

							</div>
						</div>
					</div>
					<div class="rs-content-info-line"></div>
					<div class="rs-content-info-count">
						<div class="rs-content-info-count-title">人数</div>
						<div class="rs-content-info-count-content">
							<div class="rs-content-info-count-content-num">{{planInfoEdit.numberOfPeople}}</div>
							<div class="rs-content-info-count-content-actions">
								<div class="rs-content-info-count-content-actions-less">-</div>
								<div class="rs-content-info-count-content-actions-plus">+</div>
							</div>
						</div>
					</div>
					<div class="rs-content-info-categorylist">
						<div class="rs-content-info-categorylist-title">人员</div>
					</div>
					<div class="rs-content-info-categorylist">
						<div class="rs-content-info-categorylist-title">未定人员</div>
					</div>
				</div>
			</template>
			<!-- 交通卡 -->
			<template v-else-if="rightInfo.type===1">
				<div>
					
				</div>
			</template>
			<!-- 住宿卡 -->
			<template v-else-if="rightInfo.type===2">
				<div class="rs-content-hotel">
					<div class="rs-content-hotel-header">
						<div class="rs-content-hotel-header-title">住宿卡</div>
						<div contenteditable='false' class="rs-content-hotel-header-action">
							<div class="rs-content-hotel-header-action-filter" @click="rightInfo.isShowFilter=!rightInfo.isShowFilter"></div>
							<div class="rs-content-hotel-header-action-add" @click="sectionRightHotelHeaderAddButtonClickEvent"></div>
						</div>
					</div>
					<div class="rs-content-hotel-search">
						<div class="rs-content-hotel-search-bar" :style="{ backgroundColor: rightInfo.isInputSearch ? 'white' : '#F9F9F9' }">
							<input type="text" 
								placeholder="搜索" 
								v-model="rightInfo.searchContent" 
								@focus="rightInfo.isInputSearch=true" 
								@blur="rightInfo.isInputSearch=false">
							<div class="rs-content-hotel-search-bar-cancel" v-if="rightInfo.searchContent.length > 0" @click="rightInfo.searchContent=''"></div>
						</div>
					</div>
					<div class="rs-content-hotel-filter" v-if="rightInfo.isShowFilter">
						<div class="rs-content-hotel-filter-picker">
							<div class="rs-content-hotel-filter-picker-title">位置</div>
							<div class="rs-content-hotel-filter-picker-list">
								<div class="rs-content-hotel-filter-picker-list-item">国家</div>
								<div class="rs-content-hotel-filter-picker-list-item">省份</div>
								<div class="rs-content-hotel-filter-picker-list-item">城市</div>
							</div>
						</div>
						<div class="rs-content-hotel-filter-choose">
							<div class="rs-content-hotel-filter-choose-title">类型</div>
							<ul class="rs-content-hotel-filter-choose-list">
								<li class="rs-content-hotel-filter-choose-list-item"></li>
							</ul>
						</div>
						<div class="rs-content-hotel-filter-choose">
							<div class="rs-content-hotel-filter-choose-title">标签</div>
							<ul class="rs-content-hotel-filter-choose-list">
								<li class="rs-content-hotel-filter-choose-list-item"></li>
							</ul>
						</div>
						<div class="rs-content-hotel-filter-choose">
							<div class="rs-content-hotel-filter-choose-title">分组</div>
							<ul class="rs-content-hotel-filter-choose-list">
								<li class="rs-content-hotel-filter-choose-list-item"></li>
							</ul>
						</div>
					</div>
					<div class="rs-content-hotel-list">
						<HotelCard v-for="(hotelCardItem, hotelCardIndex) in hotelCardList" 
							:key="'hotel_card_item_' + hotelCardItem._id" 
							:cardInfo="hotelCardItem" 
							:cardIndex="hotelCardIndex"
							@mousedown.stop.native='sectionRightHotelItemMousedownEvent($event, hotelCardIndex)'></HotelCard>
					</div>
				</div>
			</template>
			<!-- 餐饮卡 -->
			<template v-else-if="rightInfo.type===2">
				<div>
					
				</div>
			</template>
			<!-- 景点卡 -->
			<template v-else-if="rightInfo.type===2">
				<div>
					
				</div>
			</template>
		</div>
    </div>
</template>

<script>
const {
    ipcRenderer,
    remote
} = window.require('electron');
const path = window.require('path');
const { BrowserWindow } = remote;
// import nedb from 'nedb';
import Listener from '../../../utils/Listener.js';

import Global from '../utils/Global.js';
import { Trim } from '../../../utils/String.js';
import { GetDayDateWithTimeStamp } from '../../../utils/Date.js';

import HotelCard from './HotelCard.vue';

// console.log(path.join(remote.app.getPath('userData'), 'data/resource.db'));
// const HotelCardDB = new nedb({
//     filename: path.join(remote.app.getPath('userData'), 'data/hotelcard.db'),
//     autoload: true, // 当数据存储被创建时，数据将自动从文件中加载到内存，不必去调用loadDatabase。注意所有命令操作只有在数据加载完成后才会被执行。
//     corruptAlertThreshold: 0, // 默认10%,取值在0-1之间。如果数据文件损坏率超过这个百分比，NeDB将不会启动。取0，意味着不能容忍任何数据损坏；取1，意味着忽略数据损坏问题。
// });

export default {
	name: 'RightSidebar',
	components: {
		HotelCard,
	},
	props: {
		planInfo: {
			type: Object,
		},
		rightInfo: {
			type: Object,
		}
	},
	data() {
		return {
			hotelCardList: [],
			planInfoEdit: {
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
		}
	},
	computed: {
		isAutoShowRight: function () {
			return this.$store.state.autoShowRightSidebar;
		},           
	},
	watch: {
		'planInfo': 'watchPlanInfoEvent',
		'rightInfo': {
			handler: 'watchRightInfoEvent',
			deep: true,
		}
	},
	created: function () {
		console.log("Listener", Listener);
		Listener.on(Listener.Keys.HotelCardDBModified, this.getHotelCardDBData);
		this.getHotelCardDBData();
	},
	mounted: function () {
		this.watchRightInfoEvent();
	},
	destroyed: function () {
		Listener.off(Listener.Keys.HotelCardDBModified);
	},
	methods: {
		watchPlanInfoEvent: function () {
			if (this.planInfo.name !== this.planInfoEdit.name) {
				this.planInfoEdit.name = this.planInfo.name;
				this.$refs['rs-content-info-name'].innerText = this.planInfo.name;
			}

			if (this.planInfo.desc !== this.planInfoEdit.desc) {
				this.planInfoEdit.desc = this.planInfo.desc;
				this.$refs['rs-content-info-desc'].innerText = this.planInfo.desc;
			}

			if (this.planInfoEdit.numberOfDays !== this.planInfo.numberOfDays) {
				this.planInfoEdit.numberOfDays = this.planInfo.numberOfDays;
			}

			if (this.planInfoEdit.startDate !== this.planInfo.startDate) {
				this.planInfoEdit.startDate = this.planInfo.startDate;
				this.planInfoEdit.startDateShow = GetDayDateWithTimeStamp(this.planInfoEdit.startDate);
			}

			if (this.planInfoEdit.endDate !== this.planInfo.endDate) {
				this.planInfoEdit.endDate = this.planInfo.endDate;
				this.planInfoEdit.endDateShow = GetDayDateWithTimeStamp(this.planInfoEdit.endDate);
			}

			if (this.planInfoEdit.numberOfPeople !== this.planInfo.numberOfPeople) {
				this.planInfoEdit.numberOfPeople = this.planInfo.numberOfPeople;
			}
		},

		watchRightInfoEvent: function () {
			if (!this.rightInfo) {
				setTimeout(() => {
					this.$refs['rs-content-info-name'].innerText = this.planInfo.name;
					this.$refs['rs-content-info-desc'].innerText = this.planInfo.desc;
					this.planInfoEdit.numberOfDays = this.planInfo.numberOfDays;
					this.planInfoEdit.startDateShow = GetDayDateWithTimeStamp(this.planInfoEdit.startDate);
					this.planInfoEdit.endDateShow = GetDayDateWithTimeStamp(this.planInfoEdit.endDate);

					this.watchPlanInfoEvent();
				});
			}
		},

		getHotelCardDBData: function () {
			// HotelCardDB.find({}, (err, docs) => {
			// 	console.log("HotelCardDB find all", err, docs);
			// 	if (err) {

			// 	}else {
			// 		for (var i = 0; i < docs.length; i++) {
			// 			docs[i].isShowRooms = false;
			// 			if (docs[i].rooms) {
			// 				for (var j = 0; j < docs[i].rooms.length; j++) {
			// 					docs[i].rooms[j].isShow = false;
			// 				}
			// 			}
			// 		}
					
			// 		this.hotelCardList = docs;
			// 	}
			// })
		},

		sectionRightHeaderActionAutoShowButtonClick: function () {
			this.$store.commit(Global.Store.MutationsKeys.SetAutoShowRightSidebar, !this.isAutoShowRight);
		},
		
		/**
         * 旅行计划信息 - 名字的聚焦事件
         */
        planInfoNameFocusEvent: function () {
            this.planInfoEdit.inputName = true;
        },

        /**
         * 旅行计划信息 - 名字的失焦事件
         */
        planInfoNameBlurEvent: function (event) {
            this.planInfoEdit.inputName = false;
			this.planInfoEdit.name = Trim(event.target.innerText);
			event.target.innerText = this.planInfoEdit.name;
			this.$emit("plan-info-change", {
				name: this.planInfoEdit.name
			})
        },

        /**
         * 旅行计划信息 - 名字的换行事件
         */
        planInfoNameEnterEvent: function (event) {
            this.planInfoEdit.inputName = false;
			this.planInfoEdit.name = Trim(event.target.innerText);
			event.target.innerText = this.planInfoEdit.name;
			event.target.blur();
			this.$emit("plan-info-change", {
				name: this.planInfoEdit.name
			})
		},
		
		/**
         * 旅行计划信息 - 简介的聚焦事件
         */
        planInfoDescFocusEvent: function () {
            this.planInfoEdit.inputDesc= true;
        },
		
		/**
         * 旅行计划信息 - 简介的失焦事件
         */
        planInfoDescBlurEvent: function (event) {
            this.planInfoEdit.inputDesc = false;
			this.planInfoEdit.desc = Trim(event.target.innerText);
			event.target.innerText = this.planInfoEdit.desc;
			this.$emit("plan-info-change", {
				desc: this.planInfoEdit.desc
			})
		},
		



		/**
         * 右边栏 > 住宿卡 > 新建一个住宿卡
         */
        sectionRightHotelHeaderAddButtonClickEvent: function () {
			this.$parent.isShowCoverView = true;
			var currentWindow = remote.getCurrentWindow();
			
			let childWindow = new BrowserWindow({
				width: 500,
				height: 600,
				resizable: false,
				parent: currentWindow, 
				show: false,
				center: true, // 窗口居中
				webPreferences: { // 网页功能的设置 
				devTools: true, //  是否开启 DevTools
				nodeIntegration: true,
				textAreasAreResizable: false, // 禁止TextArea元素调整大小
				},
				frame: false, // 无边框
				titleBarStyle: 'hiddenInset', 
				fullscreen: false,
				fullscreenable: false,
				maximizable: false,
				minimizable: false,
				movable: false,
			})
			
			childWindow.once('ready-to-show', () => {
				childWindow.show();
			})
			childWindow.on('closed', () => {
				this.$parent.isShowCoverView = false;
				currentWindow.setFocusable(true);
				// mainWindow.webContents.send('child-window-closed');
			});

			if (window.process.env.runtype === 'dev') {
                childWindow.loadURL('http://localhost:8080/CreateHotelCard.html');
            }else {
				childWindow.loadFile('dist/CreateHotelCard.html');
			}

			currentWindow.setFocusable(false);
			
            // ipcRenderer.send('create-hotel-card');
        },

        /**
         * 右边栏 > 住宿卡 > 点击一个住宿卡
         */
        sectionRightHotelItemMousedownEvent: function (event, hotelCardIndex) {
			console.log("【Right Sidebar】 sectionRightHotelItemMousedownEvent");
            var tempHotelCardItem = this.hotelCardList[hotelCardIndex];
            this.$parent.movingCard.type = 2;
            this.$parent.movingCard.content = "住宿：" + tempHotelCardItem.name;
            this.$parent.movingCard.data = tempHotelCardItem;
            this.$parent.movingCard.x = event.x;
            this.$parent.movingCard.y = event.y;
            this.$parent.isTouchedACard = true;
        },
	}
}
</script>

<style lang="scss" scoped>
.right-sidebar {
    width: 240px;
	height: 100%;
	border-left: 1px solid lightgray;
	background-color: white;

	.rs-header {
		width: calc(100% - 20px);
		height: 30px;
		padding: 0 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		background-color: white;
		border-bottom: 1px solid lightgray;
	}

	.rs-header-title {
		font-size: 12px;
		color: #666666;
		line-height: 1;
	}

	.rs-header-actions {
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.rs-header-actions-autoshow {
		width: 16px;
		height: 16px;
		background-image: url(../assets/section_right_auto_show.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		cursor: pointer;
	}

	.rs-header-actions-show {
		width: 16px;
		height: 16px;
		background-image: url(../assets/section_right_show.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		cursor: pointer;
	}





	.rs-content {
		width: 100%;
		height: calc(100% - 30px - 1px);
	}


	/* 计划基本信息 */
	.rs-content-info {
		padding: 10px;
		width: calc(100% - 20px);
		height: calc(100% - 20px);
		overflow-y: auto;
	}

	.rs-content-info-name {
		width: calc(100% - 2px);
		border: 1px solid transparent;
	}

	.rs-content-info-name-focus {
		border: 1px solid lightgray;
		background-color: white;
		border-radius: 4px;
	}

	.rs-content-info-name-placeholder {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		font-size: 18px;
		font-weight: 500;
		color: lightgray;
		line-height: 1.5;
	}

	.rs-content-info-name-text {
		font-size: 18px;
		font-weight: 500;
		line-height: 1.5;
	}

	.rs-content-info-desc {
		margin-top: 10px;
		width: calc(100% - 2px);
		border: 1px solid transparent;
	}

	.rs-content-info-desc-focus {
		border: 1px solid lightgray;
		background-color: white;
		border-radius: 4px;
	}

	.rs-content-info-desc-placeholder {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		font-size: 14px;
		font-weight: 300;
		color: lightgray;
		line-height: 1.5;
	}

	.rs-content-info-desc-text {
		font-size: 14px;
		font-weight: 300;
		line-height: 1.5;
	}

	.rs-content-info-line {
		margin-top: 10px;
		margin-bottom: 10px;
		height: 1px;
		background-color: lightgray;
		width: 100%;
	}

	.rs-content-info-count {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.rs-content-info-count-title {
		font-size: 14px;
		line-height: 1;
		width: 70px;
		text-align: right;
		color: #333333;
	}

	.rs-content-info-count-content {
		width: calc(100% - 80px - 2px);
		margin-left: 10px;
		border: 1px solid transparent;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 30px;
	}

	.rs-content-info-count-content:hover {
		border: 1px solid lightgray;
		background-color: white;
		border-radius: 4px;
	}

	.rs-content-info-count-content:hover .rs-content-info-count-content-actions {
		display: flex;
	}

	.rs-content-info-count-content-num {
		width: calc(100% - 20px - 2px - 5px - 20px - 2px - 4px);
	}

	.rs-content-info-count-content-actions {
		margin-right: 4px;
		display: none;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.rs-content-info-count-content-actions-less {
		width: 20px;
		height: 20px;
		text-align: center;
		line-height: 20px;
		font-size: 16px;
		border: 1px solid lightgray;
		border-radius: 4px;
		margin-right: 5px;
		cursor: pointer;
	}

	.rs-content-info-count-content-actions-plus {
		width: 20px;
		height: 20px;
		text-align: center;
		line-height: 20px;
		font-size: 16px;
		border: 1px solid lightgray;
		border-radius: 4px;
		cursor: pointer;
	}

	.rs-content-info-date {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;

		.rs-content-info-date-title {
			font-size: 14px;
			line-height: 1;
			width: 70px;
			text-align: right;
			color: #333333;
		}

		.rs-content-info-date-content {
			width: calc(100% - 80px - 2px);
			margin-left: 10px;
			border: 1px solid transparent;
			min-height: 30px;

			.rs-content-info-date-content-show {
				font-size: 14px;
				font-weight: 300;
				line-height: 30px;
				color: #333333;
			}
		}
	}

	.rs-content-info-date-content-choose {

	}

	.rs-content-info-categorylist {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.rs-content-info-categorylist-title {
		font-size: 14px;
		line-height: 1;
		width: 70px;
		text-align: right;
		color: #333333;
	}


	/* 住宿卡 */
	.rs-content-hotel {
		width: 100%;
		height: 100%;
	}

	.rs-content-hotel-header {
		width: calc(100% - 20px);
		height: 24px;
		padding: 5px 10px;
		background-color: #F0F0F0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.rs-content-hotel-header:hover .rs-content-hotel-header-action {
		display: flex;
	}

	.rs-content-hotel-header-title {
		font-size: 14px;
		line-height: 1.5;
	}

	.rs-content-hotel-header-action {
		display: none;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.rs-content-hotel-header-action-filter {
		width: 18px;
		height: 18px;
		background-image: url(../assets/right_sidebar_filter.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		cursor: pointer;
		margin-right: 5px;
	}

	.rs-content-hotel-header-action-add {
		width: 16px;
		height: 16px;
		background-image: url(../assets/right_sidebar_add.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		cursor: pointer;
	}

	.rs-content-hotel-search {
		width: 100%;
		background-color: #F0F0F0;
		height: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.rs-content-hotel-search-bar {
		width: calc(100% - 20px - 36px);
		height: 26px;
		border-radius: 10px;
		padding-left: 10px;
		padding-right: 26px;
	}

	.rs-content-hotel-search-bar > input {
		background-color: transparent;
		font-size: 14px;
		width: 100%;
		height: 100%;
		line-height: 1;
	}

	.rs-content-hotel-search-bar-cancel {
		padding: 4px;
		width: 8px;
		height: 8px;
		border-radius: 8px;
		background-image: url(../../../assets/win_close.png);
		background-origin: content-box;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		cursor: pointer;
		position: absolute;
		top: 5px;
		right: 5px;
		background-color: lightgray;
	}

	.rs-content-hotel-filter {
		width: calc(100% - 20px);
		padding: 5px 10px;
		background-color: #F0F0F0;
		position: absolute;
		top: calc(28px + 40px);
		left: 0;
		z-index: 10;
	}

	.rs-content-hotel-filter-picker {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 4px 0;
	}

	.rs-content-hotel-filter-picker-title {
		font-size: 14px;
		line-height: 1.5;
		color: #333333;
		text-align: right;
		width: 40px;
	}

	.rs-content-hotel-filter-picker-list {
		width: calc(100% - 45px);
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
	}

	.rs-content-hotel-filter-picker-list-item {
		padding: 3px 5px;
		border: 1px solid transparent;
		text-align: center;
		font-size: 12px;
		line-height: 1;
		color: #333333;
		cursor: pointer;
	}

	.rs-content-hotel-filter-picker-list-item-selected {
		border: 1px solid dodgerblue;
		color: dodgerblue;
	}

	.rs-content-hotel-filter-choose {
		margin: 4px 0;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.rs-content-hotel-filter-choose-title {
		font-size: 14px;
		line-height: 1.5;
		color: #333333;
		text-align: right;
		width: 40px;
	}

	.rs-content-hotel-filter-choose-list {
		width: calc(100% - 45px);
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
	}

	.rs-content-hotel-filter-choose-list-item {
		padding: 3px 5px;
		border: 1px solid transparent;
		text-align: center;
		font-size: 12px;
		line-height: 1;
		color: #333333;
		cursor: pointer;
	}

	.rs-content-hotel-filter-choose-list-item-selected {
		border: 1px solid dodgerblue;
		color: dodgerblue;
	}

	.rs-content-hotel-list {
		width: 100%;
		height: calc(100% - 28px - 40px);
		overflow-y: auto;
	}

	.rs-content-hotel-list-item {
		padding: 5px 10px;
		/* border-bottom: 1px solid lightgray; */
		background-color: white;
		margin-bottom: 5px;
	}

	.rs-content-hotel-list-item-info {
		width: 100%;
	}

	.rs-content-hotel-list-item-info-name {
		width: calc(100% - 20px);
		font-size: 18px;
		font-weight: 500;
		line-height: 1.5;
	}

	.rs-content-hotel-list-item-info-type {
		font-size: 12px;
		font-weight: 300;
		color: dodgerblue;
		line-height: 1.5;
		margin-top: 3px;
	}

	.rs-content-hotel-list-item-info-tags {
		width: calc(100% + 4px);
		margin-right: -2px;
		margin-top: 4px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.rs-content-hotel-list-item-info-tags-item {
		margin: 2px;
		padding: 2px 4px;
		border: 1px solid lightgray;
		text-align: center;
		line-height: 1;
		font-size: 12px;
		color: lightgray;
		width: max-content;
		border-radius: 2px;
	}

	.rs-content-hotel-list-item-info-address {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin-top: 5px;
	}

	.rs-content-hotel-list-item-info-address-icon {
		width: 18px;
		height: 18px;
		background-image: url(../assets/address_icon.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.rs-content-hotel-list-item-info-address-content {
		width: calc(100% - 22px);
		margin-left: 4px;
		font-size: 12px;
		font-weight: 300;
		color: #888888;
		line-height: 1.5;
	}

	.rs-content-hotel-list-item-info-edit {
		position: absolute;
		width: 16px;
		height: 16px;
		background-image: url(../assets/right_sidebar_edit.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		cursor: pointer;
		top: 4px;
		right: 0px;
	}

	.rs-content-hotel-list-item-info-edit:hover {
		background-image: url(../assets/right_sidebar_edit_hover.png);
	}

	.rs-content-hotel-list-item-rooms {
		width: 100%;
		margin-top: 5px;
		border-top: 1px solid lightgray;
		padding-top: 4px;
	}

	.rs-content-hotel-list-item-rooms-header {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.rs-content-hotel-list-item-rooms-header-title {
		font-size: 14px;
		color: #555555;
		line-height: 1.5;
	}

	.rs-content-hotel-list-item-rooms-header-show {
		font-size: 12px;
		font-weight: 300;
		color: dodgerblue;
		line-height: 1.5;
		cursor: pointer;
	}

	.rs-content-hotel-list-item-rooms-list {
		width: calc(100% - 15px);
		margin-left: 15px;
	}

	.rs-content-hotel-list-item-rooms-list-item {
		width: 100%;
		border-bottom: 1px solid lightgray;
	}

	.rs-content-hotel-list-item-rooms-list-item-info {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 5px 0;
	}

	.rs-content-hotel-list-item-rooms-list-item-info-name {
		font-size: 11px;
		font-weight: 300;
		line-height: 1.5;
		color: #666666;
	}

	.rs-content-hotel-list-item-rooms-list-item-info-more {
		cursor: pointer;
		width: 14px;
		height: 14px;
		background-image: url(../../../assets/hidden_999999.png);
		background-repeat: no-repeat;
		background-size: 100%;
		cursor: pointer;
	}

	.rs-content-hotel-list-item-rooms-list-item-info-more-show {
		cursor: pointer;
		width: 14px;
		height: 14px;
		background-image: url(../../../assets/show_999999.png);
		background-repeat: no-repeat;
		background-size: 100%;
		cursor: pointer;
	}

	.rs-content-hotel-list-item-rooms-list-item-more {
		width: calc(100% - 30px);
		margin-left: 15px;
	}

	.rs-content-hotel-list-item-rooms-list-item-more-text {
		font-size: 12px;
		font-weight: 300;
		color: #777777;
		line-height: 1.5;
	}
}
</style>