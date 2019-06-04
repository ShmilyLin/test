<template>
	<div class="home">
		<TopMenu :topToolMode="topToolMode" 
			@top-tool-mode="topMenuToolModeChangeEvent" 
			@mouseenter.native="homeTopMouseEnterEvent" 
			@mouseleave.native="homeTopMouseLeaveEvent"></TopMenu>
		<TopTools v-if="topToolMode === 0 || showTopTools || showTopToolsSelf" 
			:class="{ 'home-top-tools' : topToolMode === 0 , 'home-top-tools-absolute': topToolMode !== 0 }" 
			@mouseenter.native="homeTopToolsMouseEnterEvent" 
			@mouseleave.native="homeTopToolsMouseLeaveEvent"></TopTools>
		<div class="home-section" :style="{ height : topToolMode === 0 ? 'calc(100% - 40px - 100px - 1px - 30px - 1px)' : 'calc(100% - 40px - 1px - 30px - 1px)'}">
			<div class="dragscroll home-section-content" :style="{ width: (isAutoShowRight ? rightInfo : true) ? 'calc(100% - 240px - 1px)' : '100%' }">
				<div class="home-section-canvas">
					<DayItem v-for="(dayItem, dayIndex) in dayList" 
                        :key="dayItem.timestamp" 
						:ref="'section-canvas-day-' + dayIndex" 
						:class="{ 'home-section-canvas-day-selected': dayItem.isSelected }" 
						:dayItem="dayItem"
						:dayIndex="dayIndex"></DayItem>
				</div>
			</div>
			<transition name="section-right">
				<RightSidebar v-if="isAutoShowRight ? rightInfo : true" 
					:planInfo="planInfo" 
					@plan-info-change="rightSidebarPlanInfoChangeEvent"></RightSidebar>
			</transition>
		</div>
		<Footer></Footer>
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
		}
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

		}
	}
}


.section-right-enter-active, .section-right-leave-active {
    transition: all 0.5s linear;
}
.section-right-enter, .section-right-leave-to {
    margin-right: -240px;
}
</style>
