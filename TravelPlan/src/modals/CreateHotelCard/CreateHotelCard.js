const {
    ipcRenderer,
    remote
} = require('electron');

var vm = new Vue({
    el: '#app',
    data() {
        return {
            platform: "", // 平台


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
            console.log("watch type");
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
            this.name = event.target.innerText;
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
            this.address = event.target.innerText;
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
                priceUnit: "",
                numberOfRooms: 0,
                NumberOfPeopleAvailable: {
                    adult: 0,
                    child: 0,
                    canExtraBed: false,
                },
                numberOfBreakfast: 0,
                nonsmoking: true,
                squareMeter: 0,
                windowTyps: "",
                bedType: "",
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
        }
    },
})