function HotelModel() {
    this.defaultHotel = null; // HotelCardModel
    this.defaultRoom = null; // HotelRoomModel
    this.rooms = []; // 备选房型[HotelRoomModel]
    this.hotels = []; // 备选酒店[HotelCardModel]
}

HotelModel.prototype.constructor = HotelModel;

module.exports = HotelModel;