<template>
    <div class="day-item" 
        :class="{ 'day-item-selected': dayItem.isSelected }" 
        @click.stop="dayItemSelectedEvent" 
        @focus="dayItemSelectedEvent">
        <div class="day-item-header">
            <div class="day-item-header-title">
                <div class="day-item-header-title-placeholder" v-if="!dayItem.inputTitle && (!dayItem.title || dayItem.title.length <= 0)">请输入主题</div>
                <div class="day-item-header-title-text" 
                    contenteditable="plaintext-only" 
                    :class="{ 'day-item-header-title-text-focus': dayItem.inputTitle }" 
                    ref="day-item-title-input"
                    @mousedown.stop 
                    @focus="dayItemTitleFocusEvent" 
                    @blur="dayItemTitleBlurEvent($event)"></div>
            </div>
            <div class="day-item-header-subtitle">
                <div class="day-item-header-subtitle-placeholder" v-if="!dayItem.inputSubtitle && (!dayItem.subtitle || dayItem.subtitle.length <= 0)">请输入副主题</div>
                <div class="day-item-header-subtitle-text" 
                    contenteditable="plaintext-only" 
                    :class="{ 'day-item-header-subtitle-text-focus': dayItem.inputSubtitle }" 
                    ref="day-item-subtitle-input-"
                    @mousedown.stop 
                    @focus="dayItemSubtitleFocusEvent" 
                    @blur="dayItemSubtitleBlurEvent($event)"></div>
            </div>
            
            <div class="day-item-header-desc" 
                v-for="(dayDescItem, dayDescIndex) in dayItem.descList" 
                :key="'dayItem.timestamp' + '_desc_' + dayDescItem.timestamp">
                <div class="day-item-header-desc-placeholder" v-if="!dayDescItem.inputDesc && (!dayDescItem.content || dayDescItem.content.length <= 0)">请输入说明</div>
                <div class="day-item-header-desc-text" 
                    contenteditable="plaintext-only" 
                    :class="{ 'day-item-header-desc-text-focus': dayDescItem.inputDesc }" 
                    :ref="'day-item-desc-input-' + dayDescIndex"
                    @mousedown.stop 
                    @focus="dayItemDescItemFocusEvent(dayDescIndex)" 
                    @blur="dayItemDescItemBlurEvent($event, dayDescIndex)"
                    @keydown.enter.prevent="dayItemDescItemBlurEvent($event, dayDescIndex)"></div>
            </div>
            <div class="day-item-header-desc">
                <div class="day-item-header-desc-placeholder" v-if="!dayItem.inputDesc && (!dayItem.descContent || dayItem.descContent.length <= 0)">请输入说明</div>
                <div class="day-item-header-desc-text" 
                    contenteditable="plaintext-only" 
                    :class="{ 'day-item-header-desc-text-focus': dayItem.inputDesc }" 
                    ref="day-item-desc-input"
                    @mousedown.stop 
                    @focus="dayItemDescContentFocusEvent" 
                    @blur="dayItemDescContentBlurEvent($event)" 
                    @keydown.enter.prevent="dayItemDescContentEnterEvent($event)"></div>
            </div>
        </div>
        <div class="day-item-plan" 
            v-for="(planItem, planIndex) in dayItem.plans" 
            :key="dayItem.timestamp + '_' + planItem.timestamp" 
            :ref="'day-item-plan-' + planIndex"
            :class="{ 'day-item-plan-some': dayItem.plans.length > 1 }">
            <div class="day-item-plan-name" 
                :class="{ 'day-item-plan-name-input': planItem.inputName }" 
                v-if="dayItem.plans.length > 1">
                <input type="text" 
                    placeholder="输入计划名称" 
                    v-model="planItem.name" 
                    @focus="planItem.inputName=true" 
                    @blur="planItem.inputName=false">
            </div>
            <div class="day-item-plan-content">
                <div class="day-item-plan-content-item" 
                    v-for="(planListItem, planListIndex) in planItem.list" 
                    :key="dayItem.timestamp + '_' + planItem.timestamp + '_' + planListItem.timestamp" 
                    :class="{ 'day-item-plan-content-item-edit': planListItem.isEditor }" 
                    @click="dayPlanListItemClickEvent($event, planIndex, planListIndex)">
                    <div class="day-item-plan-content-item-left">
                        <!-- 起点 -->
                        <template v-if="planListItem.type === 0">
                            <div class="day-plan-list-item-start">
                                <div class="day-plan-list-item-start-name" :class="{ 'day-plan-list-item-start-name-focus': planListItem.inputPointName }">
                                    <input type="text" 
                                        v-model="planListItem.pointName" 
                                        placeholder="集合地点" 
                                        @click.stop 
                                        @focus="planListItemPointNameFocusEvent(planIndex, planListIndex)" 
                                        @blur="planListItem.inputPointName=false">
                                </div>
                                <div class="day-plan-list-item-start-path">
                                    <div class="day-plan-list-item-start-path-icon"></div>
                                    <ul class="day-plan-list-item-start-path-list">
                                        <li class="day-plan-list-item-start-path-list-item" 
                                            v-for="(pathItem, pathIndex) in getDayPlanPath(planIndex)" 
                                            :key="dayItem.timestamp + '_' + planItem.timestamp + '_' + planListItem.timestamp + '_' + pathItem.id">
                                            <div class="day-plan-list-item-start-path-list-item-front" v-if="pathIndex > 0"></div>
                                            <div class="day-plan-list-item-start-path-list-item-point">{{pathItem.content}}</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </template>
                        <!-- 交通 -->
                        <template v-else-if="planListItem.type === 1">
                            <div class="day-plan-list-item-traffic">
                                
                            </div>
                        </template>
                        <!-- 住宿 -->
                        <template v-else-if="planListItem.type === 2">
                            <PlanHotelItem :planListItem="planListItem" 
                                :planListIndex="planListIndex" 
                                :ref="'day-plan-list-item-hotel-' + planIndex + '-' + planListIndex" 
                                @show-add-room="planListItemHotelShowAddRoom(planIndex, planListIndex)"></PlanHotelItem>
                        </template>
                        <!-- 餐饮 -->
                        <template v-else-if="planListItem.type === 3">
                            <div class="day-plan-list-item-food">
                                
                            </div>
                        </template>
                        <!-- 景点 -->
                        <template v-else-if="planListItem.type === 4">
                            <div class="day-plan-list-item-attraction">
                                
                            </div>
                        </template>
                        <!-- 说明 -->
                        <template v-else-if="planListItem.type === 5">
                            <div class="day-plan-list-item-text" :class="{ 'day-plan-list-item-text-focus': planListItem.inputContent }">
                                <div class="day-plan-list-item-text-placeholder" v-if="!planListItem.inputContent && (!planListItem.content || planListItem.content.length <= 0)">请输入描述文字</div>
                                <div class="day-plan-list-item-text-input" 
                                    contenteditable="plaintext-only" 
                                    :ref="'day-plan-list-item-text-input-' + planListIndex"
                                    @mousedown.stop 
                                    @click.stop
                                    @focus="dayPlanListItemTextFocusEvent(planIndex, planListIndex)" 
                                    @blur="dayPlanListItemTextBlurEvent($event, planIndex, planListIndex)"></div>
                            </div>
                        </template>
                        <!-- 图片 -->
                        <template v-else-if="planListItem.type === 6">
                            <div class="day-plan-list-item-image">
                                
                            </div>
                        </template>
                        <!-- 清单 -->
                        <template v-else-if="planListItem.type === 7">
                            <div class="day-plan-list-item-list">
                                
                            </div>
                        </template>
                    </div>
                    <div class="day-item-plan-content-item-right">
                        <div class="day-item-plan-content-item-right-add"></div>
                        <div class="day-item-plan-content-item-right-more"></div>
                        <div class="day-item-plan-content-item-right-move"></div>
                    </div>
                </div>
                <div class="day-item-plan-content-new">
                    <div class="day-item-plan-content-new-start" @click="createAPlanListItem(planIndex, 0)"></div>
                    <div class="day-item-plan-content-new-traffic" @click.stop="createAPlanListItem(planIndex, 1)"></div>
                    <div class="day-item-plan-content-new-hotel" @click.stop="createAPlanListItem(planIndex, 2)"></div>
                    <div class="day-item-plan-content-new-food" @click="createAPlanListItem(planIndex, 3)"></div>
                    <div class="day-item-plan-content-new-attraction" @click="createAPlanListItem(planIndex, 4)"></div>
                    <div class="day-item-plan-content-new-text" @click.stop="createAPlanListItem(planIndex, 5)"></div>
                    <div class="day-item-plan-content-new-image" @click="createAPlanListItem(planIndex, 6)"></div>
                    <div class="day-item-plan-content-new-list" @click="createAPlanListItem(planIndex, 7)"></div>
                </div>
            </div>
        </div>
        <div class="day-item-plan-new">

        </div>
    </div>
</template>

<script>
import { Trim } from '../../../utils/String';

import PlanHotelItem from './PlanHotelItem.vue';

export default {
    name: 'DayItem',
    components: {
        PlanHotelItem
    },
    props: {
        dayItem: {
            type: Object,
            required: true,
        },
        dayIndex: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            
        }
    },
    mounted: function () {
        if (this.dayItem && this.dayItem.title) {
            this.$refs['day-item-title-input'].innerText = this.dayItem.title;
        }
    },
	methods: {
        /**
         * 点击自己
         */
        dayItemSelectedEvent: function () {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
            this.$parent.cancelSelectedItem(this.dayIndex, -1, -1);
            this.$parent.rightInfo = null;
        },
		/**
         * 标题的聚焦事件
         */
        dayItemTitleFocusEvent: function () {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.inputTitle = true;

            for (var i = 0; i < this.$parent.dayList.length; i++) {
                if (i != this.dayIndex) {
                    var tempForDayItem = this.$parent.dayList[i];
                    if (tempForDayItem.isSelected) {
                        tempForDayItem.isSelected = false;
                        this.$parent.$set(this.$parent.dayList, i, tempForDayItem);
                    }
                }
            }

            tempDayItem.isSelected = true;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
        },

        /**
         * 标题的失焦事件
         */
        dayItemTitleBlurEvent: function (event) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.inputTitle = false;
            tempDayItem.title = Trim(event.target.innerText);
            event.target.innerText = tempDayItem.title;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
        },

        /**
         * 副标题的聚焦事件
         */
        dayItemSubtitleFocusEvent: function () {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.inputSubtitle = true;

            for (var i = 0; i < this.$parent.dayList.length; i++) {
                if (i != this.dayIndex) {
                    var tempForDayItem = this.$parent.dayList[i];
                    if (tempForDayItem.isSelected) {
                        tempForDayItem.isSelected = false;
                        this.$parent.$set(this.$parent.dayList, i, tempForDayItem);
                    }
                }
            }

            tempDayItem.isSelected = true;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
        },

        /**
         * 副标题的失焦事件
         */
        dayItemSubtitleBlurEvent: function (event) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.inputSubtitle = false;
            tempDayItem.subtitle = Trim(event.target.innerText);
            event.target.innerText = tempDayItem.subtitle;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
        },

        /**
         * 说明的聚焦事件
         */
        dayItemDescItemFocusEvent: function (dayDescIndex) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.descList[dayDescIndex].inputDesc = true;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
        },

        /**
         * 说明的失焦事件
         */
        dayItemDescItemBlurEvent: function ($event, dayDescIndex) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            var tempContent = event.target.innerText;
            if (!tempContent || tempContent.length <= 0) {
                tempDayItem.descList.splice(dayDescIndex, 1);
                this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
            }else {
                tempDayItem.descList[dayDescIndex].content = tempContent;
                tempDayItem.descList[dayDescIndex].inputDesc = false;
                this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);

                event.target.blur();
            }
        },

        /**
         * 新建说明的聚焦事件
         */
        dayItemDescContentFocusEvent: function () {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.inputDesc = true;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
        },

        /**
         * 新建说明的失焦事件
         */
        dayItemDescContentBlurEvent: function ($event) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.inputDesc = false;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
            var tempContent = event.target.innerText;
            if (tempContent && tempContent.length > 0) {
                var tempIndex = tempDayItem.descList.length;
                tempDayItem.descList.push({
                    content: tempContent,
                    inputDesc: false,
                    timestamp: (new Date()).getTime(),
                })

                this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);

                event.target.innerText = "";

                setTimeout(() => {
                    this.$refs['day-item-desc-input-' + tempIndex][0].innerText = tempContent;
                });
            }
        },

        dayItemDescContentEnterEvent: function ($event) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            var tempContent = event.target.innerText;
            if (tempContent && tempContent.length > 0) {
                var tempIndex = tempDayItem.descList.length;
                tempDayItem.descList.push({
                    content: tempContent,
                    inputDesc: false,
                    timestamp: (new Date()).getTime(),
                })

                this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);

                event.target.innerText = "";

                setTimeout(() => {
                    this.$refs['day-item-desc-input-' + tempIndex][0].innerText = tempContent;
                });
            }
        },

        /**
         * 点击一个计划项
         */
        dayPlanListItemClickEvent: function (event, planIndex, planListIndex) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            var tempPlanItem = tempDayItem.plans[planIndex];
            var tempPlanListItem = tempPlanItem.list[planListIndex];

            if (tempPlanListItem.type === 2) { // 住宿
                tempDayItem.isSelected = true;
                tempPlanItem.isSelected = true;
                tempPlanListItem.isEditor = true;
                this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
                this.$parent.cancelSelectedItem(this.dayIndex, planIndex, planListIndex);
                this.$parent.rightInfo = {
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
         * 计划 - 项-起点 - 输入框聚焦事件
         */
        planListItemPointNameFocusEvent(planIndex, planListIndex) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[planListIndex];
            tempPlanListItem.isEditor = true;
            tempPlanListItem.inputPointName = true;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);

            this.$parent.cancelSelectedItem(this.dayIndex, planIndex, planListIndex);
        },

        /**
         * 天 - 计划 - 项-住宿 - 显示添加房间
         */
        planListItemHotelShowAddRoom(planIndex, planListIndex) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[planListIndex];
            tempPlanListItem.isEditor = true;
            tempPlanListItem.isShowAddRoom = !tempPlanListItem.isShowAddRoom;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);

            this.$parent.cancelSelectedItem(this.dayIndex, planIndex, planListIndex);
        },

        /**
         * 天 - 计划 - 项-文字 - 输入框聚焦事件
         */
        dayPlanListItemTextFocusEvent: function (planIndex, planListIndex) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[planListIndex];
            tempPlanListItem.isEditor = true;
            tempPlanListItem.inputContent = true;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);

            this.$parent.cancelSelectedItem(this.dayIndex, planIndex, planListIndex);
        },
        
        /**
         * 天 - 计划 - 项-文字 - 输入框失焦事件
         */
        dayPlanListItemTextBlurEvent: function (event, planIndex, planListIndex) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            var tempPlanItem = tempDayItem.plans[planIndex];
            var tempPlanListItem = tempPlanItem.list[planListIndex];
            tempPlanListItem.inputContent = false;
            tempPlanListItem.content = event.target.innerText;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);
        },

        /**
         * 创建一个新的计划项
         */ 
        createAPlanListItem: function (planIndex, type) {
            var tempDayItem = this.$parent.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListIndex = tempPlanItem.list.length;
            var tempPlanListItem = tempPlanItem.createAListItem(type);
            tempPlanListItem.isEditor = true;
            this.$parent.$set(this.$parent.dayList, this.dayIndex, tempDayItem);

            this.$parent.cancelSelectedItem(this.dayIndex, planIndex, tempPlanListIndex);
            
            console.log(tempPlanListItem);

            switch (type) {
                case 0:
                    this.$parent.rightInfo = null;
                    break;
                case 1:
                    this.$parent.rightInfo = {
                        type: 1,
                        
                    }
                    break;
                case 2:
                    this.$parent.rightInfo = {
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
         * 获取当天的旅游路线
         */
        getDayPlanPath: function (planIndex) {
            var tempContentList = [];
            var tempPlanItem = this.dayItem.plans[planIndex];
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
	}
}
</script>

<style lang="scss" scoped>
.day-item {
    width: calc(500px - 40px);
    min-height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px dashed lightgray;
    flex-shrink: 0;

    /* 天 > 头部 */
    .day-item-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    /* 天 > 头部 > 标题 */
    .day-item-header-title {
        width: 100%;
    }

    .day-item-header-title-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 1.5;
        font-size: 30px;
        font-weight: 500;
        text-align: center;
        color: lightgray;
    }

    .day-item-header-title-text {
        width: 100%;
        min-height: 45px;
        line-height: 1.5;
        font-size: 30px;
        font-weight: 500;
        text-align: center;
        border: 1px solid transparent;
    }

    .day-item-header-title-text-focus {
        border: 1px solid lightgray;
    }

    /* 天 > 头部 > 副标题 */
    .day-item-header-subtitle {
        width: 100%;
        margin-top: 10px;
    }

    .day-item-header-subtitle-placeholder {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        line-height: 1.5;
        font-size: 20px;
        font-weight: 500;
        text-align: center;
        color: lightgray;
    }

    .day-item-header-subtitle-text {
        width: 100%;
        min-height: 30px;
        line-height: 1.5;
        font-size: 20px;
        font-weight: 400;
        text-align: center;
        color: #555555;
        border: 1px solid transparent;
    }

    .day-item-header-subtitle-text-focus {
        border: 1px solid lightgray;
    }

    /* 天 > 头部 > 说明 */
    .day-item-header-desc {
        width: 100%;
        margin-top: 10px;
    }

    .day-item-header-desc-placeholder {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        line-height: 1.5;
        font-size: 14px;
        font-weight: 300;
        text-indent: 2;
        color: lightgray;
    }

    .day-item-header-desc-text {
        width: 100%;
        min-height: 21x;
        line-height: 1.5;
        font-size: 14px;
        font-weight: 300;
        text-indent: 2;
        color: #888888;
        border: 1px solid transparent;
    }

    .day-item-header-desc-text-focus {
        border: 1px solid lightgray;
    }




    /* 天 > 计划 */
    .day-item-plan {
        width: calc(100% - 2px - 20px);
        border: 1px solid transparent;
        padding: 10px;
    }

    .day-item-plan-some {
        border-radius: 4px;
        border: 1px solid lightskyblue;
    }

    .day-item-plan-name {
        width: calc(100% - 2px);
        border: 1px solid transparent;
        margin-bottom: 10px;
    }

    .day-item-plan-name-input {
        border: 1px solid lightgray;
    }

    .day-item-plan-name-input input {
        width: 100%;
        font-size: 20px;
        font-weight: 500;
        line-height: 1.5;
    }

    .day-item-plan-content {
        width: 100%;
    }

    .day-item-plan-content-item {
        width: calc(100% - 5px);
        padding: 5px 0;
        padding-left: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .day-item-plan-content-item-edit {
        background-color: #F5F5F5;
        border-radius: 4px;
    }

    .day-item-plan-content-item:hover {
        background-color: #F5F5F5;
        border-radius: 4px;
    }

    .day-item-plan-content-item:hover .day-item-plan-content-item-right {
        display: flex;
    }

    .day-item-plan-content-item-left {
        width: calc(100% - 22px - 5px - 24px - 24px - 1px);
    }


    /* 天 > 计划 > 项 - 起点 */
    .day-plan-list-item-start {
        width: 100%;
    }

    .day-plan-list-item-start .day-plan-list-item-start-name {
        width: calc(100% - 2px);
        border: 1px solid transparent;
    }

    .day-plan-list-item-start .day-plan-list-item-start-name-focus {
        border: 1px solid lightgray;
        border-radius: 4px;
        background-color: white;
    }

    .day-plan-list-item-start .day-plan-list-item-start-name > input {
        width: 100%;
        line-height: 30px;
        font-size: 20px;
        font-weight: 500;
    }

    .day-plan-list-item-start .day-plan-list-item-start-path {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
    }

    .day-plan-list-item-start .day-plan-list-item-start-path-icon {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        background-image: url(../assets/plan_path_icon.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .day-plan-list-item-start .day-plan-list-item-start-path-list {
        width: calc(100% - 20px - 5px);
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
    }

    .day-plan-list-item-start .day-plan-list-item-start-path-list-item {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .day-plan-list-item-start .day-plan-list-item-start-path-list-item-front {
        width: 15px;
        height: 2px;
        background-color: lightskyblue;
    }

    .day-plan-list-item-start .day-plan-list-item-start-path-list-item-point {
        font-size: 14px;
        color: #888888;
        line-height: 1.5;
        font-weight: 300;
    }


    /* 天 > 计划 > 项 - 交通 */
    .day-plan-list-item-traffic {

    }


    /* 天 > 计划 > 项 - 住宿 */
    .day-plan-list-item-hotel {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .day-plan-list-item-hotel-icon {
        margin-top: 3px;
        width: 20px;
        height: 20px;
        background-image: url(../assets/plan_list_item_new_hotel.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 5px;
    }

    .day-plan-list-item-hotel-right {
        width: calc(100% - 20px - 5px);
    }

    .day-plan-list-item-hotel-default {
        width: 100%;
    }

    .day-plan-list-item-hotel-default-none {
        color: lightgray;
        font-size: 14px;
        font-weight: 300px;
        line-height: 26px;
        width: 100%;
    }

    .day-plan-list-item-hotel-default-info {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .day-plan-list-item-hotel-default-info-name {
        font-size: 17px;
        font-weight: 500;
        line-height: 26px;
        width: calc(100% - 62px);
    }

    .day-plan-list-item-hotel-default-info-type {
        font-size: 12px;
        color: dodgerblue;
        line-height: 1;
        margin-top: 5px;
        width: 60px;
    }

    .day-plan-list-item-hotel-default-address {
        width: 100%;
        display: flex;
        flex-direction: row;
        margin-top: 4px;
    }

    .day-plan-list-item-hotel-default-address-icon {
        width: 20px;
        height: 20px;
        background-image: url(../assets/address_icon.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 4px;
    }

    .day-plan-list-item-hotel-default-address-content {
        width: calc(100% - 24px);
        font-size: 14px;
        font-weight: 300;
        color: #999999;
        line-height: 1.5;
    }

    .day-plan-list-item-hotel-default-room {
        width: 100%;
        margin-top: 5px;
    }

    .day-plan-list-item-hotel-default-room-header {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 4px 0;
    }

    .day-plan-list-item-hotel-default-room-header-title {
        font-size: 14px;
        line-height: 1;
    }

    .day-plan-list-item-hotel-default-room-header-add {
        display: none;
        width: 14px;
        height: 14px;
        background-image: url(../assets/right_sidebar_add.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .day-plan-list-item-hotel-default-room-header:hover .day-plan-list-item-hotel-default-room-header-add {
        display: block;
    }   

    .day-plan-list-item-hotel-default-room-list {
        width: calc(1005 - 15px);
        margin-left: 15px;
    }

    .day-plan-list-item-hotel-default-room-list-item {

    }

    .day-plan-list-item-hotel-default-room-list-subtitle {

    }

    .day-plan-list-item-hotel-default-room-list-item {

    }

    .day-plan-list-item-hotel-additional {

    }



    /* 天 > 计划 > 项 - 美食 */
    .day-plan-list-item-food {

    }

    .day-plan-list-item-attraction {

    }


    /* 天 > 计划 > 项 - 说明 */
    .day-plan-list-item-text {
        width: calc(100% - 2px);
        border: 1px solid transparent;
    }

    .day-plan-list-item-text-focus {
        border: 1px solid lightgray;
        border-radius: 4px;
        background-color: white;
    }

    .day-plan-list-item-text-placeholder {
        font-size: 18px;
        font-weight: 300;
        color: lightgray;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 1.5;
    }

    .day-plan-list-item-text-input {
        font-size: 18px;
        font-weight: 300;
        color: #333333;
        line-height: 1.5;
    }


    .day-plan-list-item-image {

    }

    .day-plan-list-item-list {

    }

    .day-item-plan-content-item-right {
        display: none;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }

    .day-item-plan-content-item-right-add {
        width: 18px;
        height: 18px;
        padding: 2px;
        background-origin: content-box;
        background-image: url(../assets/plan_list_item_add.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 5px;
        cursor: pointer;
    }

    .day-item-plan-content-item-right-more {
        width: 20px;
        height: 20px;
        padding: 2px;
        background-origin: content-box;
        background-image: url(../assets/plan_list_item_more.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .day-item-plan-content-item-right-move {
        width: 20px;
        height: 20px;
        padding: 2px;
        background-origin: content-box;
        background-image: url(../assets/plan_list_item_move.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }


    /* 创建一条新的计划项 */
    .day-item-plan-content-new {
        margin-top: 10px;
        width: calc(100% - 10px);
        padding: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        border-bottom: 1px solid lightgray;
    }

    .day-item-plan-content-new:hover {
        background-color: #F5F5F5;
        border-radius: 4px;
        border-bottom: 1px solid transparent;
    }

    .day-item-plan-content-new-start {
        width: 24px;
        height: 24px;
        padding: 1px;
        background-image: url(../assets/plan_list_item_new_start.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-origin: content-box;
        cursor: pointer;
    }

    .day-item-plan-content-new-start:hover {
        background-image: url(../assets/plan_list_item_new_start_hover.png);
    }

    .day-item-plan-content-new-traffic {
        width: 24px;
        height: 24px;
        padding: 1px;
        background-image: url(../assets/plan_list_item_new_traffic.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-origin: content-box;
        cursor: pointer;
    }

    .day-item-plan-content-new-traffic:hover {
        background-image: url(../assets/plan_list_item_new_traffic_hover.png);
    }

    .day-item-plan-content-new-hotel {
        width: 22px;
        height: 22px;
        padding: 2px;
        background-image: url(../assets/plan_list_item_new_hotel.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-origin: content-box;
        cursor: pointer;
    }

    .day-item-plan-content-new-hotel:hover {
        background-image: url(../assets/plan_list_item_new_hotel_hover.png);
    }

    .day-item-plan-content-new-food {
        width: 26px;
        height: 26px;
        background-image: url(../assets/plan_list_item_new_food.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-origin: content-box;
        cursor: pointer;
    }

    .day-item-plan-content-new-food:hover {
        background-image: url(../assets/plan_list_item_new_food_hover.png);
    }

    .day-item-plan-content-new-attraction {
        width: 26px;
        height: 26px;
        background-image: url(../assets/plan_list_item_new_attraction.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-origin: content-box;
        cursor: pointer;
    }

    .day-item-plan-content-new-attraction:hover {
        background-image: url(../assets/plan_list_item_new_attraction_hover.png);
    }

    .day-item-plan-content-new-text {
        width: 26px;
        height: 26px;
        background-image: url(../assets/plan_list_item_new_text.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-origin: content-box;
        cursor: pointer;
    }

    .day-item-plan-content-new-text:hover {
        background-image: url(../assets/plan_list_item_new_text_hover.png);
    }

    .day-item-plan-content-new-image {
        width: 20px;
        height: 20px;
        padding: 3px;
        background-image: url(../assets/plan_list_item_new_image.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-origin: content-box;
        cursor: pointer;
    }

    .day-item-plan-content-new-image:hover {
        background-image: url(../assets/plan_list_item_new_image_hover.png);
    }

    .day-item-plan-content-new-list {
        width: 20px;
        height: 20px;
        padding: 3px;
        background-image: url(../assets/plan_list_item_new_list.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-origin: content-box;
        cursor: pointer;
    }

    .day-item-plan-content-new-list:hover {
        background-image: url(../assets/plan_list_item_new_list_hover.png);
    }

    .day-item-plan-new {

    }
}

.day-item-selected {
        border-right: 1px solid lightskyblue;
        box-shadow: 0 0 4px 0 rgba(135, 206, 250, 0.5);
    }
</style>