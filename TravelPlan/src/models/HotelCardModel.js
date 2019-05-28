function HotelCardModel() {
    this.name = ""; // 名字
    this.address = { // 地址
        content: "",
        desc: "", 
        longitude: 0,
        latitude: 0,
    }

    this.type = ""; // 酒店类型（民宿、快捷酒店、公寓、星级酒店、短租、长租、廉价酒店、旅社、招待所、疗养院）
    this.desc = "";
}

HotelCardModel.prototype.constructor = HotelCardModel;

module.exports = HotelCardModel;