<template>
    <div class="plan-hotel-item-room">
        <div class="phir-info">
            <div class="phir-info-left">
                <div class="phir-info-left-delete" @click="deleteRoomButtonClicked"></div>
                <div class="phir-info-left-name">{{roomItem.roomType}}</div>
            </div>
            <div class="phir-info-right">
                <div class="phir-info-right-count">
                    <div class="phir-info-right-count-less" @click="countLessButtonClickEvent">-</div>
                    <div class="phir-info-right-count-num">{{roomItem.count}}{{roomItem.roomUnit}}</div>
                    <div class="phir-info-right-count-plus" @click="countPlusButtonClickEvent">+</div>
                </div>
                <div class="phir-info-right-price">
                    <div class="phir-info-right-price-unit">{{roomItem.priceUnit}}</div>
                    <div class="phir-info-right-price-input">
                        <input type="text" v-model.lazy="roomItem.price" @change="inputPriceChangeEvent($event)">
                    </div>
                </div>
            </div>
        </div>
        <div class="phir-mark" v-if="roomItem.isShowMark">
            <div class="phir-mark-placeholder">请输入房型备注</div>
            <div class="phir-mark-input" 
                contenteditable="plaintext-only"></div>
        </div>
        <div class="phir-detail" v-if="roomItem.isShow">
            <div class="phir-detail-text">房间大小: {{roomItem.squareMeter}}㎡</div>
            <div class="phir-detail-text">可住人数: {{roomItem.numberOfPeopleAvailable.adult}}名成年人{{roomItem.numberOfPeopleAvailable.child > 0 ? '， ' + roomItem.numberOfPeopleAvailable.child + '名儿童' : ''}}{{roomItem.numberOfPeopleAvailable.canExtraBed ? '（可加床）' : '（不可加床）'}}</div>
            <div class="phir-detail-text">床型说明: {{roomItem.bedType}}</div>
            <div class="phir-detail-text">房间窗户: {{roomItem.windowTyps}}</div>
            <div class="phir-detail-text">{{roomItem.nonsmoking ? '房间禁烟' : '房间可以吸烟'}}</div>
            <div class="phir-detail-text" v-if="roomItem.roomDesc && roomItem.roomDesc.length > 0">房间说明: {{roomItem.roomDesc}}</div>
        </div>
        <div class="phir-total" v-if="roomItem.isShowTotal">
            <div class="phir-total-front">总计：</div>
            <div class="phir-total-count">{{roomItem.price * roomItem.count}}</div>
        </div>
    </div>
</template>

<script>
import Global from '../utils/Global.js';
export default {
    name: 'PlanHotelItemRoom',
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
        },
        roomListName: {
            type: String,
            required: true,
        },
        roomIndex: {
            type: Number,
            required: true,
        }
    },
    computed: {
        roomItem: function () {
            return this.$store.state.dayList[this.dayIndex].plans[this.planIndex].list[this.planListIndex].hotal.defaultHotel[this.roomListName][this.roomIndex];
        }
    },
	methods: {
        // 点击删除房型
        deleteRoomButtonClicked: function () {
            var tempDayItem = this.$store.state.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[this.planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[this.planListIndex];
            tempPlanListItem.isEditor = true;
            tempPlanListItem.hotal.defaultHotel[this.roomListName].splice(this.roomIndex, 1);

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
        },

        // 点击减少一间
        countLessButtonClickEvent: function () {
            // this.$emit('less');
            var tempDayItem = this.$store.state.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[this.planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[this.planListIndex];
            tempPlanListItem.isEditor = true;
            var tempCount = tempPlanListItem.hotal.defaultHotel[this.roomListName][this.roomIndex].count;
            if (tempCount > 0) {
                tempPlanListItem.hotal.defaultHotel.defaultRooms[this.roomIndex].count--;
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

            this.$forceUpdate();
        },

        // 点击增加一间
        countPlusButtonClickEvent: function () {
            // this.$emit('plus');
            var tempDayItem = this.$store.state.dayList[this.dayIndex];
            tempDayItem.isSelected = true;
            var tempPlanItem = tempDayItem.plans[this.planIndex];
            tempPlanItem.isSelected = true;
            var tempPlanListItem = tempPlanItem.list[this.planListIndex];
            tempPlanListItem.isEditor = true;
            tempPlanListItem.hotal.defaultHotel[this.roomListName][this.roomIndex].count++;

            this.$store.commit(Global.Store.MutationsKeys.ModifiedDayListItem, {
                index: this.dayIndex,
                item: tempDayItem
            })

            this.$store.commit(Global.Store.MutationsKeys.CancelSelectedDayListItem, {
                dayIndex: this.dayIndex,
                planIndex: this.planIndex,
                planListItemIndex: this.planListIndex
            })

            this.$forceUpdate();
        },

        // 输入价格事件
        inputPriceChangeEvent: function (event) {
            this.$emit('price-change', );
        }
	}
}
</script>

<style lang="scss" scoped>
.plan-hotel-item-room {
    width: 100%;
    padding: 5px 0px;
    
    .phir-info {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .phir-info-left {
            display: flex;
            flex-direction: row;
            align-items: center;
            
            .phir-info-left-delete {
                width: 20px;
                height: 20px;
                background-image: url(../../../assets/circle_delete.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                margin-right: 5px;
                cursor: pointer;
            }

            .phir-info-left-name {
                font-size: 14px;
                color: #666666;
                line-height: 1.5;
            }
        }
        
        .phir-info-right {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            
            .phir-info-right-count {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                width: calc(22px + 44px + 22px);
                
                &:hover {
                    .phir-info-right-count-less {
                        display: block;
                    }

                    .phir-info-right-count-plus {
                        display: block;
                    }
                }

                .phir-info-right-count-less {
                    width: 20px;
                    height: 20px;
                    border: 1px solid lightgray;
                    display: none;
                    text-align: center;
                    line-height: 20px;
                    font-size: 18px;
                    cursor: pointer;
                }

                .phir-info-right-count-num {
                    width: 44px;
                    font-size: 14px;
                    color: #666666;
                    line-height: 1;
                    text-align: center;
                }

                .phir-info-right-count-plus {
                    width: 20px;
                    height: 20px;
                    border: 1px solid lightgray;
                    display: none;
                    text-align: center;
                    line-height: 20px;
                    font-size: 18px;
                    cursor: pointer;
                }
            }
            
            .phir-info-right-price {
                height: 26px;
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-left: 10px;

                .phir-info-right-price-unit {
                    margin-right: 5px;
                    font-size: 14px;
                    line-height: 1;
                    color: #666666;
                }

                .phir-info-right-price-input {
                    width: 46px;
                    height: 26px;

                    input {
                        width: calc(100% - 2px);
                        height: calc(100% - 2px);
                        border: 1px solid transparent;
                        border-radius: 4px;
                        color: red;
                        font-size: 16px;
                        font-weight: 500;
                        line-height: 1;

                        &:focus {
                            border: 1px solid lightgray;
                        }
                    }
                }
            }
        }
    }
    
    .phir-mark {
        
        
        .phir-mark-placeholder {

        }
        
        .phir-mark-input {

        }
    }
    
    .phir-detail {
        
        
        .phir-detail-text {

        }
    }
    
    .phir-total {
        
        
        .phir-total-front {

        }
        
        .phir-total-count {

        }
    }
}
</style>