function HotelModel() {
    this.defaultHotel = null; // HotelCardModel

    this.hotels = []; // 备选酒店[HotelCardModel]
}

HotelModel.prototype.constructor = HotelModel;

module.exports = HotelModel;