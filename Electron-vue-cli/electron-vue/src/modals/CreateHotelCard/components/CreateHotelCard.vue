<template>
    <div class="create-hotel-card">
        <div class="chc-header">
            <div class="chc-header-title">创建住宿卡</div>
        </div>
        <div class="chc-section">
            <div class="chc-section-inputitem">
                <div class="chc-section-inputitem-placeholder chc-section-inputitem-placeholder-name" 
                    :class="{ 'chc-section-inputitem-placeholder-typing': inputName || name.length > 0 }">住宿地点的名称</div>
                <div class="chc-section-inputitem-input section-inputitem-input-name" 
                    :class="{ 'chc-section-inputitem-typing': inputName }" 
                    contenteditable="plaintext-only" 
                    ref="chc-section-inputitem-input-name" 
                    @focus="inputNameFocusEvent" 
                    @blur="inputNameBlurEvent($event)"></div>
            </div>
            <div class="chc-section-inputitem">
                <div class="chc-section-inputitem-placeholder chc-section-inputitem-placeholder-type" 
                    :class="{ 'chc-section-inputitem-placeholder-typing': inputType || type.length > 0 }">住宿地点的类型</div>
                <div class="chc-section-inputitem-input chc-section-inputitem-input-type" 
                    :class="{ 'chc-section-inputitem-typing': inputType }">
                    <input type="text" 
                        v-model.trim="type"
                        @keydown.tab.stop.prevent="inputTypeTabKeyDownEvent($event)" 
                        @keyup.tab.stop.prevent 
                        @keydown.enter="inputTypeEnterKeyDownEvent($event)" 
                        @focus="inputTypeFocusEvent" 
                        @blur="inputTypeBlurEvent">
                </div>
                <div class="chc-section-inputitem-input-list" v-if="inputType && type.length > 0 && typeList && typeList.length > 0">
                    <div class="chc-section-inputitem-input-list-item" 
                        :class="{ 'chc-section-inputitem-input-list-item-selected': typeItemIndex===typeIndex }" 
                        v-for="(typeItem, typeItemIndex) in typeList" 
                        :key="typeItem.id" 
                        @mouseenter="typeIndex=typeItemIndex" 
                        @mousedown="type=typeItem.content">{{typeItem.content}}</div>
                </div>
            </div>
            <div class="chc-section-lineItem"></div>
            <div class="chc-section-inputitem chc-section-inputitem-address">
                <div class="chc-section-inputitem-placeholder chc-section-inputitem-placeholder-address" 
                    :class="{ 'chc-section-inputitem-placeholder-typing-address': inputCountry || country.length > 0 }">所在国家</div>
                <div class="chc-section-inputitem-input chc-section-inputitem-input-address" 
                    :class="{ 'chc-section-inputitem-typing': inputCountry }">
                    <input type="text" 
                        v-model.trim="country"
                        @focus="inputCountryFocusEvent" 
                        @blur="inputCountryBlurEvent">
                </div>
            </div>
            <div class="chc-section-inputitem chc-section-inputitem-address">
                <div class="chc-section-inputitem-placeholder chc-section-inputitem-placeholder-address" 
                    :class="{ 'chc-section-inputitem-placeholder-typing-address': inputProvince || province.length > 0 }">所在省</div>
                <div class="chc-section-inputitem-input chc-section-inputitem-input-address" 
                    :class="{ 'chc-section-inputitem-typing': inputProvince }">
                    <input type="text" 
                        v-model.trim="province"
                        @focus="inputProvinceFocusEvent" 
                        @blur="inputProvinceBlurEvent">
                </div>
            </div>
            <div class="chc-section-inputitem chc-section-inputitem-address">
                <div class="chc-section-inputitem-placeholder chc-section-inputitem-placeholder-address" 
                    :class="{ 'chc-section-inputitem-placeholder-typing-address': inputCity || city.length > 0 }">所在城市</div>
                <div class="chc-section-inputitem-input chc-section-inputitem-input-address" 
                    :class="{ 'chc-section-inputitem-typing': inputCity }">
                    <input type="text" 
                        v-model.trim="city"
                        @focus="inputCityFocusEvent" 
                        @blur="inputCityBlurEvent">
                </div>
            </div>
            <div class="chc-section-inputitem chc-section-inputitem-address">
                <div class="chc-section-inputitem-placeholder chc-section-inputitem-placeholder-address" 
                    :class="{ 'chc-section-inputitem-placeholder-typing-address': inputDistrict || district.length > 0 }">所在区/县</div>
                <div class="chc-section-inputitem-input chc-section-inputitem-input-address" 
                    :class="{ 'chc-section-inputitem-typing': inputDistrict }">
                    <input type="text" 
                        v-model.trim="district"
                        @focus="inputDistrictFocusEvent" 
                        @blur="inputDistrictBlurEvent">
                </div>
            </div>
            <div class="chc-section-inputitem chc-section-inputitem-address">
                <div class="chc-section-inputitem-placeholder chc-section-inputitem-placeholder-address" 
                    :class="{ 'chc-section-inputitem-placeholder-typing-address': inputAddress || address.length > 0 }">详细地址</div>
                <div class="chc-section-inputitem-input chc-section-inputitem-input-address" 
                    :class="{ 'chc-section-inputitem-typing': inputAddress }" 
                    contenteditable="plaintext-only" 
                    ref="chc-section-inputitem-input-address"
                    @focus="inputAddressFocusEvent" 
                    @blur="inputAddressBlurEvent($event)"></div>
            </div>
            <div class="chc-section-lineItem"></div>
            <div class="chc-section-roomsItem">
                <div class="chc-section-roomsItem-header">房型</div>
                <ul class="chc-section-roomsItem-list">
                    <li class="chc-section-roomsItem-list-item" v-for="(roomItem, roomIndex) in rooms" :key="roomItem.id">
                        <div class="chc-section-roomsItem-list-item-header">
                            <div class="chc-section-roomsItem-list-item-header-left">
                                <div class="chc-section-roomsItem-list-item-header-delete" @click="roomItemDeleteButtonClickEvent(roomIndex)"></div>
                                <div class="chc-section-roomsItem-list-item-header-name" :class="{ 'chc-section-roomsItem-list-item-header-name-input': roomItem.inputRoomType }">
                                    <input type="text" 
                                        placeholder="请输入房型" 
                                        v-model.trim="roomItem.roomType" 
                                        @focus="roomItem.inputRoomType=true" 
                                        @blur="roomItem.inputRoomType=false">
                                </div>
                            </div>
                            <div :class="roomItem.isShow ? 'chc-section-roomsItem-list-item-header-show' : 'chc-section-roomsItem-list-item-header-hidden'" @click="roomItemShowDetailButtonClickEvent(roomIndex)"></div>
                        </div>
                        <div class="chc-section-roomsItem-list-item-section" v-if="roomItem.isShow">
                            <div class="chc-section-roomsItem-list-item-section-1">
                                <div class="chc-section-roomsItem-list-item-section-1-title">平米数:</div>
                                <div class="chc-section-roomsItem-list-item-section-1-input">
                                    <input type="text" v-model.trim="roomItem.squareMeter" placeholder="0" @blur="roomItemSquareMeterInputBlurEvent(roomIndex)">
                                </div>
                            </div>
                            <div class="chc-section-roomsItem-list-item-section-1">
                                <div class="chc-section-roomsItem-list-item-section-1-title">房间数量单位:</div>
                                <div class="chc-section-roomsItem-list-item-section-1-input">
                                    <input type="text" v-model.trim="roomItem.roomUnit" placeholder="间">
                                </div>
                            </div>
                            <div class="chc-section-roomsItem-list-item-section-1">
                                <div class="chc-section-roomsItem-list-item-section-1-title">房间价格单位:</div>
                                <div class="chc-section-roomsItem-list-item-section-1-input">
                                    <input type="text" v-model.trim="roomItem.priceUnit" placeholder="人民币">
                                </div>
                            </div>
                            <div class="chc-section-roomsItem-list-item-section-3">
                                <div class="chc-section-roomsItem-list-item-section-3-title">可住人数:</div>
                                <div class="chc-section-roomsItem-list-item-section-3-right">
                                    <div class="chc-section-roomsItem-list-item-section-3-right-number">
                                        <div class="chc-section-roomsItem-list-item-section-3-right-number-item">
                                            <div class="chc-section-roomsItem-list-item-section-3-right-number-item-title">成年人</div>
                                            <div class="chc-section-roomsItem-list-item-section-3-right-number-item-input">
                                                <input type="text" v-model.trim="roomItem.numberOfPeopleAvailable.adult" placeholder="1" @blur="roomItemNumOfAdultInputBlurEvent(roomIndex)">
                                            </div>
                                        </div>
                                        <div class="chc-section-roomsItem-list-item-section-3-right-number-item">
                                            <div class="chc-section-roomsItem-list-item-section-3-right-number-item-title">儿童</div>
                                            <div class="chc-section-roomsItem-list-item-section-3-right-number-item-input">
                                                <input type="text" v-model.trim="roomItem.numberOfPeopleAvailable.child" placeholder="0" @blur="roomItemNumOfChildInputBlurEvent(roomIndex)">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chc-section-roomsItem-list-item-section-3-right-checkbox" @click="roomItem.numberOfPeopleAvailable.canExtraBed=!roomItem.numberOfPeopleAvailable.canExtraBed">
                                        <div :class="roomItem.numberOfPeopleAvailable.canExtraBed ? 'chc-section-roomsItem-list-item-section-3-right-checkbox-checked' : 'chc-section-roomsItem-list-item-section-3-right-checkbox-none'"></div>
                                        <div class="chc-section-roomsItem-list-item-section-3-right-checkbox-desc">是否可以加床</div>
                                    </div>
                                </div>
                            </div>
                            <div class="chc-section-roomsItem-list-item-section-1">
                                <div class="chc-section-roomsItem-list-item-section-1-title">窗户:</div>
                                <div class="chc-section-roomsItem-list-item-section-1-input">
                                    <input type="text" v-model.trim="roomItem.windowTyps">
                                </div>
                            </div>
                            <div class="chc-section-roomsItem-list-item-section-3">
                                <div class="chc-section-roomsItem-list-item-section-3-title">其他设置:</div>
                                <div class="chc-section-roomsItem-list-item-section-3-right">
                                    <div class="chc-section-roomsItem-list-item-section-3-right-input">
                                        <div class="chc-section-roomsItem-list-item-section-3-right-input-title">免费提供早餐数量</div>
                                        <div class="chc-section-roomsItem-list-item-section-3-right-input-input">
                                            <input type="text" v-model.trim="roomItem.numberOfBreakfast" placeholder="0" @blur="roomItemNumberOfBreakfastInputBlurEvent(roomIndex)">
                                        </div>
                                    </div>
                                    <div class="chc-section-roomsItem-list-item-section-3-right-checkbox" @click="roomItem.nonsmoking=!roomItem.nonsmoking">
                                        <div :class="roomItem.nonsmoking ? 'chc-section-roomsItem-list-item-section-3-right-checkbox-checked' : 'chc-section-roomsItem-list-item-section-3-right-checkbox-none'"></div>
                                        <div class="chc-section-roomsItem-list-item-section-3-right-checkbox-desc">禁烟</div>
                                    </div>
                                </div>
                            </div>
                            <div class="chc-section-roomsItem-list-item-section-4">
                                <div class="chc-section-roomsItem-list-item-section-4-title">床型说明:</div>
                                <div class="chc-section-roomsItem-list-item-section-4-right" 
                                    contenteditable="plaintext-only" 
                                    ref="chc-section-roomsItem-list-item-section-4-right-bedtype"
                                    @blur="inputBedtypeBlurEvent($event, roomIndex)"></div>
                            </div>
                            <div class="chc-section-roomsItem-list-item-section-4">
                                <div class="chc-section-roomsItem-list-item-section-4-title">房间说明:</div>
                                <div class="chc-section-roomsItem-list-item-section-4-right" 
                                    contenteditable="plaintext-only" 
                                    ref="chc-section-roomsItem-list-item-section-4-right-roomdesc"
                                    @blur="inputRoomdescBlurEvent($event, roomIndex)"></div>
                            </div>
                        </div>
                        <div class="chc-section-roomsItem-list-item-line"></div>
                    </li>
                    <li class="chc-section-roomsItem-list-item-add" @click="addRoomButtonClickEvent">
                        <div class="chc-section-roomsItem-list-item-add-icon"></div>
                        <div class="chc-section-roomsItem-list-item-add-text">添加一个房型</div>
                    </li>
                </ul>
            </div>
            <div class="chc-section-lineItem" style="margin-top: 10px;"></div>
            <div class="chc-section-actions">
                <div class="chc-section-actions-confirm" @click="createAHotelCardButtonClickEvent">创建住宿卡</div>
            </div>
        </div>
        <modal-view v-if="isShowModal" :content="modalContent" @confirm-click="isShowModal=false"></modal-view>
    </div>
</template>

<script>
const {
    ipcRenderer,
    remote
} = window.require('electron');
import Listener from '../../../utils/Listener.js';
import { Trim } from '@/utils/String.js';

export default {
    name: 'CreateHotelCard',
    data() {
        return {
            platform: "", // 平台

            isShowModal: false,
            modalContent: "",

            name: "",
            inputName: false,

            type: "",
            inputType: false,
            typeList: [],
            typeDataList: [{
                content: "酒店",
                id: 0,
                isSelected: false,
            }, {
                content: "一星酒店",
                id: 1,
                isSelected: false,
            }, {
                content: "二星酒店",
                id: 2,
                isSelected: false,
            }, {
                content: "三星酒店",
                id: 3,
                isSelected: false,
            }, {
                content: "四星酒店",
                id: 4,
                isSelected: false,
            }, {
                content: "五星酒店",
                id: 5,
                isSelected: false,
            }, {
                content: "快捷酒店",
                id: 6,
                isSelected: false,
            }, {
                content: "宾馆",
                id: 7,
                isSelected: false,
            }, {
                content: "招待所",
                id: 8,
                isSelected: false,
            }, {
                content: "旅社",
                id: 9,
                isSelected: false,
            }, {
                content: "民宿",
                id: 10,
                isSelected: false,
            }, {
                content: "公寓",
                id: 11,
                isSelected: false,
            }, {
                content: "短租",
                id: 12,
                isSelected: false,
            }, {
                content: "长租",
                id: 13,
                isSelected: false,
            }],
            typeIndex: 0,

            country: "",
            inputCountry: false,

            province: "",
            inputProvince: false,

            city: "",
            inputCity: false,

            district: "",
            inputDistrict: false,

            address: "",
            inputAddress: false,

            rooms: [],
        }
    },
    watch: {
        'type': function () {
            var tempType = this.type;
            var tempList = [];
            for (var i = 0; i < this.typeDataList.length; i++) {
                if (this.typeDataList[i].content.indexOf(tempType) >= 0) {
                    tempList.push(this.typeDataList[i]);
                }
            }

            this.typeIndex = 0;
            this.typeList = tempList;
        }
    },
    created: function () {
        console.log(window.process);
        if (window.process.platform === "darwin") {
            this.platform = "mac";
        }else if (window.process.platform.indexOf('win') >= 0) {
            this.platform = "win";
        }
    },
	methods: {
		/**
         * 输入文字
         */
        inputNameFocusEvent: function () {
            this.inputName = true;
        },

        inputNameBlurEvent: function (event) {
            this.inputName = false;
            this.name = Trim(event.target.innerText);
            event.target.innerText = this.name;
        },

        /**
         * 输入类型
         */
        inputTypeFocusEvent: function () {
            this.inputType = true;
            this.typeList = [];
        },

        inputTypeBlurEvent: function () {
            this.inputType = false;
            this.typeList = [];
        },

        inputTypeTabKeyDownEvent: function (event) {
            console.log("inputTypeTabKeyDownEvent", event);
            if (this.typeList && this.typeList.length > 0) {
                if (this.typeIndex == this.typeList.length - 1) {
                    this.typeIndex = 0;
                }else {
                    this.typeIndex++;
                }
            }
        },
        
        inputTypeEnterKeyDownEvent: function (event) {
            console.log("inputTypeEnterKeyDownEvent", event.target.innerText);
            if (this.typeList && this.typeList.length > 0) {
                if (this.typeIndex < this.typeList.length) {
                    this.type = this.typeList[this.typeIndex].content;
                    event.target.blur();
                    this.inputType = false;
                    this.typeList = [];
                }
            }
        },

        /**
         * 输入国家
         */
        inputCountryFocusEvent: function () {
            this.inputCountry = true;
        },

        inputCountryBlurEvent: function (event) {
            this.inputCountry = false;
        },

        /**
         * 输入省
         */
        inputProvinceFocusEvent: function () {
            this.inputProvince = true;
        },

        inputProvinceBlurEvent: function (event) {
            this.inputProvince = false;
        },

        /**
         * 输入城市
         */
        inputCityFocusEvent: function () {
            this.inputCity = true;
        },

        inputCityBlurEvent: function (event) {
            this.inputCity = false;
        },

        /**
         * 输入区/县
         */
        inputDistrictFocusEvent: function () {
            this.inputDistrict = true;
        },

        inputDistrictBlurEvent: function (event) {
            this.inputDistrict = false;
        },

        /**
         * 输入详细地址
         */
        inputAddressFocusEvent: function () {
            this.inputAddress = true;
        },

        inputAddressBlurEvent: function (event) {
            this.inputAddress = false;
            this.address = Trim(event.target.innerText);
            event.target.innerText = this.address;
        },

        /**
         * 点击添加一个房型
         */
        addRoomButtonClickEvent: function () {
            this.rooms.push({
                id: (new Date()).getTime(),
                isShow: false,
                roomType: "",
                inputRoomType: false,
                roomUnit: "间",
                originalPrice: "",
                price: "",
                priceUnit: "¥",
                numberOfRooms: 0,
                numberOfPeopleAvailable: {
                    adult: 1,
                    child: 0,
                    canExtraBed: false,
                },
                numberOfBreakfast: 0,
                nonsmoking: true,
                squareMeter: 0,
                windowTyps: "",
                bedType: "",
                roomDesc: "",
            })
        },

        /**
         * 点击删除一个房型
         */
        roomItemDeleteButtonClickEvent: function (roomIndex) {
            this.rooms.splice(roomIndex, 1);
        },

        /**
         * 点击显示一个房型信息 
         */
        roomItemShowDetailButtonClickEvent: function (roomIndex) {
            var tempRoomItem = this.rooms[roomIndex];
            tempRoomItem.isShow = !tempRoomItem.isShow;
            this.$set(this.rooms, roomIndex, tempRoomItem);
        },

        /**
         * 输入平米数的失焦事件
         */
        roomItemSquareMeterInputBlurEvent: function (roomIndex) {
            var tempRoomItem = this.rooms[roomIndex];
            if (typeof tempRoomItem.squareMeter === 'string') {
                try {
                    tempRoomItem.squareMeter = parseInt(tempRoomItem.squareMeter.replace(/[^0-9]/ig,""));
                    this.$set(this.rooms, roomIndex, tempRoomItem);
                }catch (error) {
                    console.log("roomItemSquareMeterInputBlurEvent 转换平米数失败", error);
                }
            }
        },

        /**
         * 输入可住成年人数的失焦事件
         */
        roomItemNumOfAdultInputBlurEvent: function (roomIndex) {
            var tempRoomItem = this.rooms[roomIndex];
            if (typeof tempRoomItem.numberOfPeopleAvailable.adult === 'string') {
                try {
                    tempRoomItem.numberOfPeopleAvailable.adult = parseInt(tempRoomItem.numberOfPeopleAvailable.adult.replace(/[^0-9]/ig,""));
                    this.$set(this.rooms, roomIndex, tempRoomItem);
                }catch (error) {
                    console.log("roomItemNumOfAdultInputBlurEvent 转换可住成年人数失败", error);
                }
            }
        },

        /**
         * 输入可住儿童数的失焦事件
         */
        roomItemNumOfChildInputBlurEvent: function (roomIndex) {
            var tempRoomItem = this.rooms[roomIndex];
            if (typeof tempRoomItem.numberOfPeopleAvailable.child === 'string') {
                try {
                    tempRoomItem.numberOfPeopleAvailable.child = parseInt(tempRoomItem.numberOfPeopleAvailable.child.replace(/[^0-9]/ig,""));
                    this.$set(this.rooms, roomIndex, tempRoomItem);
                }catch (error) {
                    console.log("roomItemNumOfChildInputBlurEvent 转换可住儿童数失败", error);
                }
            }
        },

        /**
         * 输入免费提供早餐数的失焦事件
         */
        roomItemNumberOfBreakfastInputBlurEvent: function (roomIndex) {
            var tempRoomItem = this.rooms[roomIndex];
            if (typeof tempRoomItem.numberOfBreakfast === 'string') {
                try {
                    tempRoomItem.numberOfBreakfast = parseInt(tempRoomItem.numberOfBreakfast.replace(/[^0-9]/ig,""));
                    this.$set(this.rooms, roomIndex, tempRoomItem);
                }catch (error) {
                    console.log("roomItemNumberOfBreakfastInputBlurEvent 转换免费提供早餐数失败", error);
                }
            }
        },

        /**
         * 床型说明输入框失焦事件
         */
        inputBedtypeBlurEvent: function (event, roomIndex) {
            var tempRoomItem = this.rooms[roomIndex];
            tempRoomItem.bedType = event.target.innerText;
            this.$set(this.rooms, roomIndex, tempRoomItem);
        },

        /**
         * 房间说明输入框失焦事件
         */
        inputRoomdescBlurEvent: function (event, roomIndex) {
            var tempRoomItem = this.rooms[roomIndex];
            tempRoomItem.roomDesc = event.target.innerText;
            this.$set(this.rooms, roomIndex, tempRoomItem);
        },

        /**
         * 点击创建一个住宿卡
         */
        createAHotelCardButtonClickEvent: function () {
            var hotelSave = {};
            if (!this.name || typeof this.name !== 'string' || this.name.length <= 0) {
                this.modalContent = "住宿卡的名称不可以为空",
                this.isShowModal = true;
                return;
            }

            hotelSave.name = this.name;

            if (!this.type || typeof this.type !== 'string' || this.type.length <= 0) {
                this.modalContent = "住宿卡的类型不可以为空",
                this.isShowModal = true;
                return;
            }

            hotelSave.type = this.type;
            hotelSave.address = {
                country: "",
                province: "",
                city: "",
                district: "",
                content: ""
            }

            if (this.country && typeof this.country === 'string' && this.country.length > 0) {
                hotelSave.address.country = this.country;
            }

            if (this.province && typeof this.province === 'string' && this.province.length > 0) {
                hotelSave.address.province = this.province;
            }

            if (this.city && typeof this.city === 'string' && this.city.length > 0) {
                hotelSave.address.city = this.city;
            }

            if (this.district && typeof this.district === 'string' && this.district.length > 0) {
                hotelSave.address.district = this.district;
            }

            if (this.address && typeof this.address === 'string' && this.address.length > 0) {
                hotelSave.address.content = this.address;
            }

            hotelSave.group = null;
            hotelSave.tags = [];

            hotelSave.rooms = [];
            if (this.rooms && this.rooms.length > 0) {
                for (var i = 0; i < this.rooms.length; i++) {
                    var tempRoomItem = this.rooms[i];
                    
                    if (tempRoomItem.roomType && typeof tempRoomItem.roomType === 'string' && tempRoomItem.roomType.length > 0) {
                        var roomSave = {};
                        roomSave.roomType = tempRoomItem.roomType;

                        if (tempRoomItem.roomUnit && typeof tempRoomItem.roomUnit === 'string' && tempRoomItem.roomUnit.length > 0) {
                            roomSave.roomUnit = tempRoomItem.roomUnit;
                        }else {
                            roomSave.roomUnit = "间";
                        }

                        if (tempRoomItem.squareMeter) {
                            try {
                                roomSave.squareMeter = parseFloat(tempRoomItem.squareMeter);
                            }catch (error) {
                                console.log("createAHotelCardButtonClickEvent 平米数转换失败", error);
                                roomSave.squareMeter = 0;
                            }
                        }else {
                            roomSave.squareMeter = 0;
                        }

                        if (tempRoomItem.priceUnit && typeof tempRoomItem.priceUnit === 'string' && tempRoomItem.priceUnit.length > 0) {
                            roomSave.priceUnit = tempRoomItem.priceUnit;
                        }else {
                            roomSave.priceUnit = "¥";
                        }

                        roomSave.originalPrice = "";
                        roomSave.price = "";
                        roomSave.numberOfPeopleAvailable = {
                            adult: 1,
                            child: 0,
                            canExtraBed: false,
                        };
                        if (tempRoomItem.numberOfPeopleAvailable) {
                            if (tempRoomItem.numberOfPeopleAvailable.adult) {
                                try {
                                    roomSave.numberOfPeopleAvailable.adult = parseInt(tempRoomItem.numberOfPeopleAvailable.adult);
                                }catch (error) {
                                    console.log("createAHotelCardButtonClickEvent 可住成年人数转换失败", error);
                                }
                            }

                            if (tempRoomItem.numberOfPeopleAvailable.child) {
                                try {
                                    roomSave.numberOfPeopleAvailable.child = parseInt(tempRoomItem.numberOfPeopleAvailable.child);
                                }catch (error) {
                                    console.log("createAHotelCardButtonClickEvent 可住儿童数转换失败", error);
                                }
                            }

                            roomSave.numberOfPeopleAvailable.canExtraBed = tempRoomItem.numberOfPeopleAvailable.canExtraBed;
                        }

                        if (tempRoomItem.windowTyps && typeof tempRoomItem.windowTyps === 'string' && tempRoomItem.windowTyps.length > 0) {
                            roomSave.windowTyps = tempRoomItem.windowTyps;
                        }else {
                            roomSave.windowTyps = "";
                        }

                        roomSave.numberOfBreakfast = 0;
                        if (tempRoomItem.numberOfBreakfast) {
                            try {
                                roomSave.numberOfBreakfast = parseInt(tempRoomItem.numberOfBreakfast);
                            }catch (error) {
                                console.log("createAHotelCardButtonClickEvent 免费提供早产数转换失败", error);
                            }
                        }

                        roomSave.nonsmoking = tempRoomItem.nonsmoking;
                        if (tempRoomItem.bedType && typeof tempRoomItem.bedType === 'string' && tempRoomItem.bedType.length > 0) {
                            roomSave.bedType = tempRoomItem.bedType;
                        }else {
                            roomSave.bedType = "";
                        }

                        if (tempRoomItem.roomDesc && typeof tempRoomItem.roomDesc === 'string' && tempRoomItem.roomDesc.length > 0) {
                            roomSave.roomDesc = tempRoomItem.roomDesc;
                        }else {
                            roomSave.roomDesc = "";
                        }

                        roomSave.id = hotelSave.rooms.length;
                        hotelSave.rooms.push(roomSave);
                    }
                }
            }

            console.log("createAHotelCardButtonClickEvent hotelSave", hotelSave);

            this.$CardDB.Transaction((transaction) => {
                console.log("【Create Hotel Card】 transaction", transaction);
                transaction.HOTELCARD.Insert(hotelSave);
            }, (error) => {
                if (error) {
                    console.log("【Create Hotel Card】 transaction fail", error);
                }else {
                    Listener.done(Listener.Keys.HotelCardDBModified);
                    var currentWindow = remote.getCurrentWindow();
                    currentWindow.close();
                }
            })
            // HotelCardDB.insert(hotelSave, (err, newDoc) => {
            //     console.log("插入一条住宿卡回调", err, newDoc);
                // Listener.done(Listener.Keys.HotelCardDBModified);
                // var currentWindow = remote.getCurrentWindow();
                // currentWindow.close();
            // })
        }
	}
}
</script>

<style lang="scss" scoped>
.create-hotel-card {
    width: 100%;
    height: 100%;

    .chc-header {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid lightgray;
    }

    .chc-header-title {
        font-size: 18px;
        line-height: 1;
        max-width: calc(100% - 30px);
    }



    .chc-section {
        width: calc(100% - 30px);
        height: calc(100% - 40px - 1px - 30px);
        overflow-x: hidden;
        overflow-y: auto;
        padding: 15px;
    }

    .chc-section-inputitem {
        width: 100%;
        padding-top: 34px;
        margin: 4px 0;
    }

    .chc-section-inputitem-address {
        padding-top: 28px;
    }

    .chc-section-inputitem-placeholder {
        position: absolute;
        top: 34px;
        left: 0;
        width: calc(100% - 22px);
        padding: 5px 11px;
        font-size: 18px;
        line-height: 27px;
        transition: all 0.5s;
        color: lightgray;
    }

    .chc-section-inputitem-placeholder-name {
        font-weight: 500;
    }

    .chc-section-inputitem-placeholder-type {
        font-size: 16px;
    }

    .chc-section-inputitem-placeholder-address {
        top: 28px;
        font-size: 14px;
        line-height: 21px;
    }

    .chc-section-inputitem-placeholder-typing {
        font-weight: normal;
        font-size: 16px;
        line-height: 27px;
        top: 0;
        color: #666666;
    }

    .chc-section-inputitem-placeholder-typing-address {
        font-weight: normal;
        font-size: 14px;
        line-height: 21px;
        top: 0;
        color: #666666;
    }

    .chc-section-inputitem-input {
        width: calc(100% - 2px - 20px);
        padding: 5px 10px;
        border: 1px solid lightgray;
        border-radius: 4px;
        font-size: 18px;
        line-height: 27px;
        min-height: 27px;
    }

    .chc-section-inputitem-input-name {
        font-weight: 500;
    }

    .chc-section-inputitem-input-address {
        font-size: 14px;
        line-height: 21px;
        min-height: 21px;
    }

    .chc-section-inputitem-input > input {
        width: 100%;
        font-size: 18px;
        line-height: 27px;
        height: 27px;
    }

    .chc-section-inputitem-input-type > input {
        font-size: 16px;
    }

    .chc-section-inputitem-input-address > input {
        font-size: 14px;
        line-height: 21px;
        height: 21px;
    }

    .chc-section-inputitem-typing {
        /* border: 1px solid lightgray; */
    }



    .chc-section-inputitem-input-list {
        width: calc(100% - 2px);
        max-height: 150px;
        border-radius: 4px;
        overflow-y: auto;
        border: 1px solid lightgray;
        position: absolute;
    }

    .chc-section-inputitem-input-list-item {
        width: calc(100% - 40px);
        padding: 7px 20px;
        color: #666666;
        line-height: 1;
        font-size: 14px;
    }

    .chc-section-inputitem-input-list-item-selected {
        background-color: lightskyblue;
    }


    .chc-section-lineItem {
        width: 100%;
        height: 1px;
        background-color: lightgray;
        margin-top: 34px;
    }



    .chc-section-roomsItem {
        width: 100%;
        margin-top: 15px;
    }

    .chc-section-roomsItem-header {
        width: 100%;
        padding: 5px 0;
        font-size: 18px;
        line-height: 1;
        color: #333333;
    }

    .chc-section-roomsItem-list {
        width: 100
    }


    .chc-section-roomsItem-list-item {
        width: calc(100% - 10px);
        padding: 0 5px;
    }

    .chc-section-roomsItem-list-item-header {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 5px 0;
    }

    .chc-section-roomsItem-list-item-header-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: calc(100% - 24px);
    }

    .chc-section-roomsItem-list-item-header-delete {
        width: 20px;
        height: 20px;
        background-image: url(../../../assets/circle_delete.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .chc-section-roomsItem-list-item-header-name {
        margin-left: 5px;
        width: calc(100% - 25px - 2px);
        font-size: 14px;
        line-height: 1;
        color: #555555;
        border: 1px solid transparent;
        padding: 5px 0;
        border-radius: 4px;
    }

    .chc-section-roomsItem-list-item-header-name-input {
        border: 1px solid lightgray;
    }

    .chc-section-roomsItem-list-item-header-name > input {
        width: 100%;
        height: 100%;
        font-size: 16px;
        line-height: 1;
    }

    .chc-section-roomsItem-list-item-header-show {
        width: 16px;
        height: 16px;
        background-image: url(../../../assets/show_999999.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .chc-section-roomsItem-list-item-header-hidden {
        width: 16px;
        height: 16px;
        background-image: url(../../../assets/hidden_999999.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }

    .chc-section-roomsItem-list-item-section {
        width: calc(100% - 25px - 24px);
        margin-left: 25px;
        padding-bottom: 5px;
    }

    .chc-section-roomsItem-list-item-section-1 {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px 0;
    }

    .chc-section-roomsItem-list-item-section-1-title {
        font-size: 14px;
        line-height: 1;
        text-align: justify;
        text-align-last: justify;
        width: 90px;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-1-input {
        width: calc(100% - 95px - 8px - 2px);
        margin-left: 5px;
        border-radius: 4px;
        border: 1px solid lightgray;
        padding: 4px;
        height: 14px;
    }

    .chc-section-roomsItem-list-item-section-1-input > input {
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-2 {
        width: 100%;
        display: flex;
        flex-direction: row;
        padding: 4px 0;
    }

    .chc-section-roomsItem-list-item-section-2-title {
        font-size: 14px;
        line-height: 22px;
        text-align: justify;
        text-align-last: justify;
        width: 90px;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-2-right {
        width: calc(100% - 95px - 8px);
        margin-left: 5px;
    }

    .chc-section-roomsItem-list-item-section-2-right-unit {
        width: 100%;
        margin-bottom: 5px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .chc-section-roomsItem-list-item-section-2-right-unit-title {
        font-size: 12px;
        width: 50px;
        line-height: 1;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-2-right-unit-input {
        margin-left: 3px;
        width: 60px;
        border: 1px solid lightgray;
        height: 20px;
        padding: 0 3px;
        border-radius: 4px;
    }

    .chc-section-roomsItem-list-item-section-2-right-unit-input > input {
        width: 100%;
        height: 100%;
        font-size: 12px;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-2-right-price {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .chc-section-roomsItem-list-item-section-2-right-price-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 15px;
    }

    .chc-section-roomsItem-list-item-section-2-right-price-item-title {
        font-size: 12px;
        color: #333333;
        line-height: 1;
    }

    .chc-section-roomsItem-list-item-section-2-right-price-item-input {
        margin-left: 3px;
        width: 60px;
        border: 1px solid lightgray;
        height: 20px;
        padding: 0 3px;
        border-radius: 4px;
    }

    .chc-section-roomsItem-list-item-section-2-right-price-item-input > input {
        width: 100%;
        height: 100%;
        font-size: 12px;
        color: #333333;
    }


    .chc-section-roomsItem-list-item-section-3 {
        width: 100%;
        display: flex;
        flex-direction: row;
        padding: 4px 0;
    }

    .chc-section-roomsItem-list-item-section-3-title {
        font-size: 14px;
        line-height: 22px;
        text-align: justify;
        text-align-last: justify;
        width: 90px;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-3-right {
        width: calc(100% - 95px - 8px);
        margin-left: 5px;
    }

    .chc-section-roomsItem-list-item-section-3-right-number {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 8px;
    }

    .chc-section-roomsItem-list-item-section-3-right-number-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 15px;
    }

    .chc-section-roomsItem-list-item-section-3-right-number-item-title {
        font-size: 12px;
        line-height: 1;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-3-right-number-item-input {
        margin-left: 3px;
        width: 60px;
        border: 1px solid lightgray;
        height: 20px;
        padding: 0 3px;
        border-radius: 4px;
    }

    .chc-section-roomsItem-list-item-section-3-right-number-item-input > input {
        width: 100%;
        height: 100%;
        font-size: 12px;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-3-right-checkbox {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
    }

    .chc-section-roomsItem-list-item-section-3-right-checkbox-checked {
        width: 18px;
        height: 18px;
        border-radius: 9px;
        background-image: url(../../../assets/checkbox_checked_1e90ff.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
    }

    .chc-section-roomsItem-list-item-section-3-right-checkbox-none {
        width: 16px;
        height: 16px;
        border-radius: 9px;
        border: 1px solid lightgray;
    }

    .chc-section-roomsItem-list-item-section-3-right-checkbox-desc {
        margin-left: 4px;
        font-size: 12px;
        color: #333333;
        line-height: 1;
    }

    .chc-section-roomsItem-list-item-section-3-right-input {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 15px;
    }

    .chc-section-roomsItem-list-item-section-3-right-input-title {
        font-size: 12px;
        line-height: 1;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-3-right-input-input {
        margin-left: 3px;
        width: 60px;
        border: 1px solid lightgray;
        height: 20px;
        padding: 0 3px;
        border-radius: 4px;
    }

    .chc-section-roomsItem-list-item-section-3-right-input-input > input {
        width: 100%;
        height: 100%;
        font-size: 12px;
        color: #333333;
    }


    .chc-section-roomsItem-list-item-section-4 {
        width: 100%;
        display: flex;
        flex-direction: row;
        padding: 4px 0;
    }

    .chc-section-roomsItem-list-item-section-4-title {
        font-size: 14px;
        line-height: 22px;
        text-align: justify;
        text-align-last: justify;
        width: 90px;
        color: #333333;
    }

    .chc-section-roomsItem-list-item-section-4-right {
        width: calc(100% - 95px - 8px - 2px);
        margin-left: 5px;
        font-size: 12px;
        color: #333333;
        line-height: 1.5;
        border-radius: 4px;
        border: 1px solid lightgray;
        padding: 4px;
    }

    .chc-section-roomsItem-list-item-line {
        width: calc(100% - 25px - 24px);
        height: 1px;
        background-color: lightgray;
        margin-left: 25px;
    }








    .chc-section-roomsItem-list-item-add {
        width: calc(100% - 10px);
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px;
        cursor: pointer;
        margin-top: 5px;
    }

    .chc-section-roomsItem-list-item-add:hover {
        background-color: #F5F5F5;
        border-radius: 4px;
    }

    .chc-section-roomsItem-list-item-add-icon {
        width: 16px;
        height: 16px;
        background-image: url(../../../assets/add_999999.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .chc-section-roomsItem-list-item-add-text {
        margin-left: 5px;
        font-size: 12px;
        line-height: 1;
        color: #999999;
    }



    .chc-section-actions {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
    }

    .chc-section-actions-confirm {
        width: 120px;
        text-align: center;
        font-size: 14px;
        line-height: 30px;
        border-radius: 4px;
        background-color: #FF6F61;
        cursor: pointer;
        color: white;
    }

    .chc-section-actions-confirm:hover {
        background-color: #E94B3C;
    }
}
</style>
