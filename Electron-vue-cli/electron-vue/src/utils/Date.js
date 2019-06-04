function GetDayDateWithTimeStamp(timestamp) {
    var tempDate = new Date(parseInt(timestamp));
    var tempYear = tempDate.getFullYear();
    var tempMonth = tempDate.getMonth() + 1;
    var tempDay = tempDate.getDay();
    return tempYear + "年" + tempMonth + "月" + tempDay + "日";
}

export {
    GetDayDateWithTimeStamp
}