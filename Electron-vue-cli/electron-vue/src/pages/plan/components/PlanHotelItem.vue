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
                            <div class="phi-default-room-header-add" @click="planListItemHotelAddRoomButtonClickEvent"></div>
                            <div class="phi-default-room-header-addrooms" v-if="planListItem.isShowAddRoom">
                                <template v-if="planListItem.hotal.defaultHotel.rooms && planListItem.hotal.defaultHotel.rooms.length > 0">
                                    <!-- <div class="" v-for=""></div> -->
                                </template>
                                <template v-else>
                                    <div class="">没有可选择的房型</div>
                                </template>
                            </div>
                        </div>
                        <ul class="phi-default-room-list">
                            <li class="phi-default-room-list-item" v-for="roomItem in planListItem.hotal.defaultHotel.defaultRooms" :key="'room_' + roomItem.id"></li>
                            <li class="phi-default-room-list-subtitle">备选</li>
                            <li class="phi-default-room-list-item" v-for="roomItem in planListItem.hotal.defaultHotel.othersRooms" :key="'room_' + roomItem.id"></li>
                        </ul>
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

export default {
    name: 'PlanHotelItem',
    props: {
        planListItem: {
            type: Object,
            required: true,
        },
        planListIndex: {
            type: Number,
            default: -1
        }
    },
	methods: {
		planListItemHotelAddRoomButtonClickEvent: function () {
            this.$emit("show-add-room");
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
        padding: 4px 0;
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
    }

    .phi-default-room-header:hover .phi-default-room-header-add {
        display: block;
    }   

    .phi-default-room-list {
        width: calc(1005 - 15px);
        margin-left: 15px;
    }

    .phi-default-room-list-item {

    }

    .phi-default-room-list-subtitle {

    }

    .phi-default-room-list-item {

    }

    .phi-additional {

    }
}
</style>