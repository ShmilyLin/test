const {
    ipcRenderer,
    remote
} = require('electron');
const path = require('path');
const nedb = require('nedb');

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
        console.log(process);
        if (process.platform === "darwin") {
            this.platform = "mac";
        }else if (process.platform.indexOf('win') >= 0) {
            this.platform = "win";
        }
    },
    mounted: function () {
        
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
                priceUnit: "人民币",
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
                            roomSave.priceUnit = "人民币";
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

            HotelCardDB.insert(hotelSave, (err, newDoc) => {
                console.log("插入一条住宿卡回调", err, newDoc);
                var currentWindow = remote.getCurrentWindow();
                currentWindow.close();
            })
        }
    },
})