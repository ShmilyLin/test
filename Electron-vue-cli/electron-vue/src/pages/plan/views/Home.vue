<template>
	<div class="home" @click="homeClickEvent">
		<TopMenu :topToolMode="topToolMode" 
			@top-tool-mode="topMenuToolModeChangeEvent" 
			@mouseenter.native="homeTopMouseEnterEvent" 
			@mouseleave.native="homeTopMouseLeaveEvent"></TopMenu>
		<TopTools v-if="topToolMode === 0 || showTopTools || showTopToolsSelf" 
			:class="{ 'home-top-tools' : topToolMode === 0 , 'home-top-tools-absolute': topToolMode !== 0 }" 
			@mouseenter.native="homeTopToolsMouseEnterEvent" 
			@mouseleave.native="homeTopToolsMouseLeaveEvent"></TopTools>
		<div class="home-section" ref="section" :style="{ height : topToolMode === 0 ? 'calc(100% - 40px - 100px - 1px - 30px - 1px)' : 'calc(100% - 40px - 1px - 30px - 1px)'}">
			<div class="dragscroll home-section-content" :style="{ width: (isAutoShowRight ? rightInfo : true) ? 'calc(100% - 240px - 1px)' : '100%' }">
				<div class="home-section-canvas">
					<DayItem v-for="(dayItem, dayIndex) in dayList" 
                        :key="dayItem.timestamp" 
						:ref="'section-canvas-day-' + dayIndex"
						:dayItem="dayItem"
						:dayIndex="dayIndex"></DayItem>
					<div class="home-section-canvas-day">
						<div class=""></div>
					</div>
				</div>
			</div>
			<transition name="section-right">
				<RightSidebar v-if="isAutoShowRight ? rightInfo : true" 
					:planInfo="planInfo" 
					:rightInfo="rightInfo" 
					@plan-info-change="rightSidebarPlanInfoChangeEvent"></RightSidebar>
			</transition>
		</div>
		<Footer></Footer>

		<div class="moving-card-background" 
			v-if="isTouchedACard" 
			@mousemove.stop="movingCardCoverViewMousemoveEvent($event)" 
			@mouseup.stop="movingCardCoverViewMouseupEvent($event)">
			<div class="moving-card" 
				:style="{ top: (movingCard.y - 20) + 'px', left: (movingCard.x - 100) + 'px' }" 
				@click.stop 
				@mousedown.stop>{{movingCard.content}}</div>
		</div>
		
		<div class="cover-view" 
			v-if="isShowCoverView" 
			@mousemove.stop 
			@mouseup.stop 
			@mousedown.stop 
			@click.stop></div>
	</div>
</template>

<script>
const {
    ipcRenderer,
    remote
} = window.require('electron');

import TopMenu from '@/pages/plan/components/TopMenu.vue';
import TopTools from '@/pages/plan/components/TopTools.vue';
import DayItem from '@/pages/plan/components/DayItem.vue';
import RightSidebar from '@/pages/plan/components/RightSidebar.vue';
import Footer from '@/pages/plan/components/Footer.vue';

import DayModel from '../models/DayModel.js';

export default {
	name: 'home',
	components: {
		TopMenu,
		TopTools,
		DayItem,
		Footer,
		RightSidebar
	},
	data() {
        return {
			platform: "", // 平台

			topToolMode: 0, // 工具栏显示模式，0为工具栏始终显示，1为工具栏鼠标悬停显示
			showTopTools: false, // 当topToolMode为1时，是否显示顶部工具栏
			showTopToolsSelf: false,

			planInfo: {
                name: "",
                desc: "",
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
			rightInfo: null, // 右边栏信息

			dayList: [], // 
			currentSelected: { // 当前选中的项
                dayIndex: -1,
                planIndex: -1,
                planListItemIndex: -1,
			},

			isTouchedACard: false,
            movingCard: {
                type: 0,
                data: null,
                x: 0,
                y: 0,
			},

			isShowCoverView: false,
        }
	},
	computed: {
		isAutoShowRight: function () { // 是否自动显示右边栏
			return this.$store.state.autoShowRightSidebar;
		}
	},
	created: function () {
		if (window.process.platform === "darwin") {
            this.platform = "mac";
        }else if (window.process.platform.indexOf('win') >= 0) {
            this.platform = "win";
		}

		if (remote.getGlobal('needOpenFile')) {

        }else {
            var tempModel = new DayModel();
            var tempPlan = tempModel.createAPlan("计划1");
            tempPlan.createAListItem(0)
            console.log(tempModel);

            this.dayList.push(tempModel);
        }
	},
	mounted: function () {
		
	},
	methods: {
		homeClickEvent: function () {
			this.cancelSelectedItem(-1, -1, -1);
            this.rightInfo = null;
		},
		/**
		 * 顶部工具栏显示状态改变
		 */
		topMenuToolModeChangeEvent: function () {
			if (this.topToolMode === 1) {
				this.topToolMode = 0;
			}else {
				this.topToolMode = 1;
			}
		},

		homeTopMouseEnterEvent: function () {
			this.showTopTools = true;
		},
		
		homeTopMouseLeaveEvent: function () {
			setTimeout(() => {
				this.showTopTools = false;
			}, 100);
		},

		homeTopToolsMouseEnterEvent: function () {
			this.showTopToolsSelf = true;
		},
		
		homeTopToolsMouseLeaveEvent: function () {
			this.showTopToolsSelf = false;
		},

		// 右边栏 - 旅行信息改变事件
		rightSidebarPlanInfoChangeEvent: function (params) {
			if ('name' in params) {
				this.planInfo.name = params.name;
			}

			if ('desc' in params) {
				this.planInfo.desc = params.desc;
			}
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
		 * 移动卡片
		 */
		movingCardCoverViewMousemoveEvent: function (event) {
            if (this.isTouchedACard) {
                this.movingCard.x = event.x;
                this.movingCard.y = event.y;
                // var eles = document.elementsFromPoint(event.x,event.y);
            }
        },

		/**
		 * 移动卡片
		 */
        movingCardCoverViewMouseupEvent: function (event) {
            if (this.isTouchedACard) {
                console.log("movingCardCoverViewMouseupEvent", event, this.$refs);
				this.isTouchedACard = false;
				// Section
                var tempSectionDom = this.$refs["section"];
                var tempSectionDomRect = tempSectionDom.getBoundingClientRect();
                if (event.x >= tempSectionDomRect.left && event.x <= (tempSectionDomRect.left + tempSectionDomRect.width) && event.y >= tempSectionDomRect.top && event.y <= (tempSectionDomRect.top + tempSectionDomRect.height)) {
					var tempDayList = this.dayList;
                    for (var i = 0; i < tempDayList.length; i++) {
						// Day
                        var tempDayDom = this.$refs['section-canvas-day-' + i][0];
                        console.log("tempDayDom", tempDayDom);
                        var tempDayDomRect = tempDayDom.$el.getBoundingClientRect();
                        if (event.x >= tempDayDomRect.left && event.x <= (tempDayDomRect.left + tempDayDomRect.width) && event.y >= tempDayDomRect.top && event.y <= (tempDayDomRect.top + tempDayDomRect.height)) {
                            var tempDayItem = tempDayList[i];
                            if (tempDayItem.plans && tempDayItem.plans.length > 0) {
                                for (var j = 0; j < tempDayItem.plans.length; j++) {
									// Plan
                                    var tempPlanDom = tempDayDom.$refs['day-item-plan-' + j][0];
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
																var tempHotelDom = tempDayDom.$refs['day-plan-list-item-hotel-' + j + '-' + n][0];
																var tempDefaultHotelDom = tempHotelDom.$refs['phi-default'];
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
	}
}
</script>


<style lang="scss" scoped>

.home {
	width: 100%;
	height: 100%;
	overflow: hidden;
	
	.home-top-tools {
		height: 100px;
		width: 100%;
		border-bottom: 1px solid lightgray;
		background-color: white;
	}

	.home-top-tools-absolute {
		position: absolute;
		top: 40px;
		height: 100px;
		width: 100%;
		border-bottom: 1px solid lightgray;
		background-color: white;
		z-index: 10;
	}

	.home-section {
		width: 100%;
		display: flex;
		flex-direction: row;
		transition: width 0.5s linear;

		.home-section-content {
			width: 100%;
			height: 100%;
			overflow: scroll;

			.home-section-canvas {
				display: flex;
				flex-direction: row;
				transition: all 0.5s linear;
				min-height: 100%;

				.home-section-canvas-day {
					width: calc(500px - 40px);
					padding: 20px;
					display: flex;
					flex-direction: column;
					align-items: center;
					border-right: 1px dashed lightgray;
					flex-shrink: 0;
				}
			}
		}
	}
}


.section-right-enter-active, .section-right-leave-active {
    transition: all 0.5s linear;
}
.section-right-enter, .section-right-leave-to {
    margin-right: -240px;
}




/* 底部 */
.footer {
    width: 100%;
    height: 30px;
    border-top: 1px solid lightgray;
}


.moving-card-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
}

.moving-card {
    position: fixed;
    background-color: white;
    width: 200px;
    padding: 5px 10px;
    opacity: 0.8;
    font-size: 12px;
    line-height: 30px;
    color: #666666;
    border: 1px solid lightgray;
}



.cover-view {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    z-index: 999;
}
</style>
