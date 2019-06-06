const HotelModel = require('./HotelModel.js');

function PlanListItemModel(type, params) {
    this.type = type;
    this.timestamp = (new Date()).getTime();
    this.isEditor = false; // 是否正在编辑
    
    switch (type) {
        case 0: // 起点（包括起点名称，当天历经地点）
            this.pointName = params && params.pointName ? params.pointName : "集合地点";
            this.inputPointName = false;
            break;
        case 1: // 交通（交通方式、班次（可选交通卡）、花费、历时、起始时间、到达时间、备选）
        
            break;
        case 2: // 住宿（住宿类型、住宿（酒店卡）、备选（酒店卡））
            this.hotal = new HotelModel();
            this.isShowAdditional = false; // 是否显示备选酒店
            this.isShowAddRoom = false; // 是否显示添加酒店
            break;
        case 3: // 餐饮（餐饮类型、餐厅（餐厅卡）、备选）

            break;
        case 4: // 景点（景点（景点卡）、花费、历时、开始时间、结束时间）
            
            break;
        case 5: // 说明
            this.inputContent = false;
            this.content = "";
            break;
        case 6: // 图片
        
            break;
        case 7: // 清单
            
            break;
    }
}

PlanListItemModel.prototype.constructor = PlanListItemModel;
PlanListItemModel.prototype.createAPlan = function(type) {
    if (!this.plans) {
        this.plans = [];
    }

    this.plans.push();
}

module.exports = PlanListItemModel;