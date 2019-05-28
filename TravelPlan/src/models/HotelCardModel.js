function HotelCardModel() {
    this.id = "";
    this.name = ""; // 名字
    this.inputName = false;

    this.address = { // 地址
        country: "",
        province: "",
        city: "",
        district: "",

        content: "",
        inputAddressContent: false,

        desc: "", 
        inputAddressDesc: false,

        longitude: 0,
        latitude: 0,
    }

    this.type = ""; // 酒店类型（民宿、快捷酒店、公寓、星级酒店、短租、长租、廉价酒店、旅社、招待所、疗养院）
    this.inputType = false;

    this.desc = "";
    this.inputDesc = false;

    this.defaultRooms = []; // [HotelRoomModel]
    this.rooms = []; // [HotelRoomModel]

    this.group = null;
    this.tags = [];
}

HotelCardModel.prototype.constructor = HotelCardModel;

module.exports = HotelCardModel;