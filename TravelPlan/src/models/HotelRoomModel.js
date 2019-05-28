function HotelRoomModel() {
    this.roomType = ""; // 房间类型
    this.roomUnit = "间"; // 房间数量单位
    this.originalPrice = ""; // 原价
    this.price = ""; // 当前价格
    this.priceUnit = ""; // 价格单位
    this.numberOfRooms = 0; // 房间数
    this.NumberOfPeopleAvailable = { // 可住人数
        adult: 0,
        child: 0,
        canExtraBed: false, // 是否可以加床
    },

    this.numberOfBreakfast = 0; // 早餐
    this.nonsmoking = true; // 禁烟
    this.squareMeter = 0; // 平米数
    this.windowTyps = ""; // 窗户（无窗、有窗、天井窗）
    this.bedType = ""; // 床型
}

HotelRoomModel.prototype.constructor = HotelRoomModel;

module.exports = HotelRoomModel;