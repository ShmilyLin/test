<template>
    <div class="plan-hotel-item">
        <div class="phi-icon"></div>
        <div class="phi-right">
            <div class="phi-default" ref="phi-default">
                <template v-if="!planListItem.hotal.defaultHotel">
                    <div class="phi-default-none">请从右边栏拖动住宿卡至此以添加住宿地点</div>
                </template>
                <template v-else>
                    <div class="phi-default-info">
                        <div class="phi-default-info-name">{{planListItem.hotal.defaultHotel.name}}</div>
                        <div class="phi-default-info-type">{{planListItem.hotal.defaultHotel.type}}</div>
                    </div>
                    <div class="phi-default-address">
                        <div class="phi-default-address-icon"></div>
                        <div class="phi-default-address-content">{{planListItem.hotal.defaultHotel.address.content}}</div>
                    </div>
                    <div class="phi-default-room">
                        <div class="phi-default-room-header">
                            <div class="phi-default-room-header-title">房型</div>
                            <div class="phi-default-room-header-add" :class="{ 'phi-default-room-header-add-show': planListItem.isShowAddRoom }" @click="planListItemHotelAddRoomButtonClickEvent"></div>
                            <div class="phi-default-room-header-addrooms" v-if="planListItem.isShowAddRoom">
                                <template v-if="planListItem.hotal.defaultHotel.rooms && planListItem.hotal.defaultHotel.rooms.length > 0">
                                    <div class="phi-default-room-header-addrooms-item" 
                                        v-for="(defaultHotelRoomItem, defaultHotelRoomIndex) in planListItem.hotal.defaultHotel.rooms" 
                                        :key="defaultHotelRoomItem.id" 
                                        @click="defaultHotelRoomItemClickEvent(defaultHotelRoomIndex)">{{defaultHotelRoomItem.roomType}}</div>
                                </template>
                                <template v-else>
                                    <div class="">没有可选择的房型</div>
                                </template>
                            </div>
                        </div>
                        <div class="phi-default-room-list">
                            <PlanHotelItemRoom class="phi-default-room-list-item" 
                                v-for="(roomItem, roomIndex) in planListItem.hotal.defaultHotel.defaultRooms" 
                                :key="'room_' + roomItem.id" 
                                :dayIndex="dayIndex" 
                                :planIndex="planIndex" 
                                :planListIndex="planListIndex" 
                                :roomListName="'defaultRooms'" 
                                :roomIndex="roomIndex"></PlanHotelItemRoom>
                                <!-- @delete="defaultHotelRoomItemDeleteEvent(roomIndex)" 
                                @less="defaultHotelRoomItemLessEvent(roomIndex)" 
                                @plus="defaultHotelRoomItemPlusEvent(roomIndex)" 
                                @price-change="defaultHotelRoomItemPriceChangeEvent($event, roomIndex)" 
                                @contextmenu.native="defaultHotelRoomItemContextmenuEvent($event, roomIndex)" -->
                            <div class="phi-default-room-list-others">
                                <div class="phi-default-room-list-subtitle">备选</div>
                                <PlanHotelItemRoom class="phi-default-room-list-item" 
                                    v-for="roomItem in planListItem.hotal.defaultHotel.othersRooms" 
                                    :key="'room_' + roomItem.id" 
                                    :dayIndex="dayIndex" 
                                    :planIndex="planIndex" 
                                    :planListIndex="planListIndex" 
                                    :roomListName="'othersRooms'" 
                                    :roomItem="roomItem"></PlanHotelItemRoom>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div class="phi-additional" v-if="planListItem.isShowAdditional">
                <template>
                    <div>拖动至此来添加备选住宿</div>
                </template>
                <template>
                    <div class="">备选住宿</div>
                    <ul class="">
                        <li class=""></li>
                        <!-- <li class="" v-if="">拖动至此来添加备选住宿</li> -->
                    </ul>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import Global from '../utils/Global.js';
import { DeepCopy } from '../../../utils/Object.js';

import PlanHotelItemRoom from './PlanHotelItemRoom.vue';

export default {
    name: 'PlanHotelItem',
    components: {
        PlanHotelItemRoom
    },
    props: {
        dayIndex: {
            type: Number,
            required: true,
        },
        planIndex: {
            type: Number,
            required: true,
        },
        planListIndex: {
            type: Number,
            required: true,
        }
    },
    computed: {
        planListItem: function () {
            return this.$store.state.dayList[this.dayIndex].plans[this.planIndex].list[this.planListIndex];
        }
    },
	methods: {
		planListItemHotelAddRoomButtonClickEvent: function () {
            var tempDayItem = this.$store.state.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[this.planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[this.planListIndex];
            tempPlanListItem.isEditor = true;
            tempPlanListItem.isShowAddRoom = !tempPlanListItem.isShowAddRoom;
            this.$store.commit(Global.Store.MutationsKeys.ModifiedDayListItem, {
                index: this.dayIndex,
                item: tempDayItem
            })

            this.$store.commit(Global.Store.MutationsKeys.CancelSelectedDayListItem, {
                dayIndex: this.dayIndex,
                planIndex: this.planIndex,
                planListItemIndex: this.planListIndex
            })
        },

        // 点击一个添加默认房型
        defaultHotelRoomItemClickEvent: function (defaultHotelRoomIndex) {
            this.planListItem.isShowAddRoom = false;
            if (!this.planListItem.hotal.defaultHotel.defaultRooms) {
                this.planListItem.hotal.defaultHotel.defaultRooms = [];
            }

            var tempDefaultHotemRoomItem = DeepCopy(this.planListItem.hotal.defaultHotel.rooms[defaultHotelRoomIndex]);
            tempDefaultHotemRoomItem.id = this.planListItem.hotal.defaultHotel.defaultRooms.length;
            this.planListItem.hotal.defaultHotel.defaultRooms.push(tempDefaultHotemRoomItem);
        },

        // 点击删除一个房型
        defaultHotelRoomItemDeleteEvent: function (roomIndex) {

        },

        // 点击一个房型的减号
        defaultHotelRoomItemLessEvent: function (roomIndex) {
            console.log("defaultHotelRoomItemLessEvent");
            var tempDayItem = this.$store.state.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[this.planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[this.planListIndex];
            tempPlanListItem.isEditor = true;
            var tempCount = tempPlanListItem.hotal.defaultHotel.defaultRooms[roomIndex].count;
            if (tempCount > 0) {
                tempPlanListItem.hotal.defaultHotel.defaultRooms[roomIndex].count--;
            }

            this.$store.commit(Global.Store.MutationsKeys.ModifiedDayListItem, {
                index: this.dayIndex,
                item: tempDayItem
            })

            this.$store.commit(Global.Store.MutationsKeys.CancelSelectedDayListItem, {
                dayIndex: this.dayIndex,
                planIndex: this.planIndex,
                planListItemIndex: this.planListIndex
            })
        },

        // 点击一个房型的加号
        defaultHotelRoomItemPlusEvent: function (roomIndex) {
            console.log("defaultHotelRoomItemPlusEvent");
            var tempDayItem = this.$store.state.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[this.planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[this.planListIndex];
            tempPlanListItem.isEditor = true;
            var tempDefaultRoomItem = tempPlanListItem.hotal.defaultHotel.defaultRooms[roomIndex];
            tempDefaultRoomItem.count++;

            // this.$set(tempDefaultRoomItem, roomIndex, tempDefaultRoomItem);
            
            this.$store.commit(Global.Store.MutationsKeys.ModifiedDayListItem, {
                index: this.dayIndex,
                item: tempDayItem
            })

            this.$store.commit(Global.Store.MutationsKeys.CancelSelectedDayListItem, {
                dayIndex: this.dayIndex,
                planIndex: this.planIndex,
                planListItemIndex: this.planListIndex
            })

            // this.$forceUpdate();
            console.log("defaultHotelRoomItemPlusEvent", this.$store.state.dayList[this.dayIndex].plans[this.planIndex].list[this.planListIndex].hotal.defaultHotel.defaultRooms[roomIndex]);
        },

        // 修改一个房型的价格
        defaultHotelRoomItemPriceChangeEvent: function ($event, roomIndex) {
            console.log("defaultHotelRoomItemPriceChangeEvent", $event, roomIndex);
        },

        // 一个房型的右键
        defaultHotelRoomItemContextmenuEvent: function ($event, roomIndex) {

        }
	}
}
</script>

<style lang="scss" scoped>
.plan-hotel-item {
    width: 100%;
    display: flex;
    flex-direction: row;

    .phi-icon {
        margin-top: 3px;
        width: 20px;
        height: 20px;
        background-image: url(../assets/plan_list_item_new_hotel.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 5px;
    }

    .phi-right {
        width: calc(100% - 20px - 5px);
    }

    .phi-default {
        width: 100%;
    }

    .phi-default-none {
        color: lightgray;
        font-size: 14px;
        font-weight: 300px;
        line-height: 26px;
        width: 100%;
    }

    .phi-default-info {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .phi-default-info-name {
        font-size: 17px;
        font-weight: 500;
        line-height: 26px;
        width: calc(100% - 62px);
    }

    .phi-default-info-type {
        font-size: 12px;
        color: dodgerblue;
        line-height: 1;
        margin-top: 5px;
        width: 60px;
    }

    .phi-default-address {
        width: 100%;
        display: flex;
        flex-direction: row;
        margin-top: 4px;
    }

    .phi-default-address-icon {
        width: 20px;
        height: 20px;
        background-image: url(../assets/address_icon.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-right: 4px;
    }

    .phi-default-address-content {
        width: calc(100% - 24px);
        font-size: 14px;
        font-weight: 300;
        color: #999999;
        line-height: 1.5;
    }

    .phi-default-room {
        width: 100%;
        margin-top: 5px;
    }

    .phi-default-room-header {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 7px 0;
        border-top: 1px solid lightgray;
        border-bottom: 1px dashed lightgray;

        &:hover {
            .phi-default-room-header-add {
                display: block;
            }
        }
    }

    .phi-default-room-header-title {
        font-size: 14px;
        line-height: 1;
    }

    .phi-default-room-header-add {
        display: none;
        width: 14px;
        height: 14px;
        background-image: url(../assets/right_sidebar_add.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        margin-right: 5px;
    }

    .phi-default-room-header-add-show {
        display: block;
    }

    .phi-default-room-header-addrooms {
        border: 1px solid lightgray;
        border-radius: 4px;
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
        min-width: 100px;
        position: absolute;
        background-color: white;
        z-index: 8;
        right: 25px;
        bottom: 0;

        .phi-default-room-header-addrooms-item {
            padding: 10px 15px;
            font-size: 16px;
            color: #666666;
            line-height: 1.5;
            cursor: pointer;

            &:hover {
                background-color: #F2F2F2;
            }
        }
    }

    .phi-default-room-list {
        width: calc(1005 - 15px);
        margin-left: 15px;
    }

    .phi-default-room-list-item {
        
    }

    .phi-default-room-list-others {
        width: 100%;

        .phi-default-room-list-subtitle {
            padding: 5px 0;
            width: 100%;
            font-size: 14px;
            line-height: 1.5;
            color: #666666;
        }
    }

    .phi-additional {

    }
}
</style>