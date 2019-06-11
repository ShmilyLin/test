var sqlite3 = require('sqlite3').verbose();

var HotelCardDB = new sqlite3.Database('hotelcard.db', (error) => {
    if (error) {
        console.log("初始化数据库失败", error);
    }else {
        console.log("初始化数据库成功");
    }
});
console.log(HotelCardDB);