const PlanModel = require("./PlanModel");

function DayModel(title) {
    this.title = title ? title : "第一天";
    this.subtitle = "";
    this.descContent = "";
    this.descList = [];

    this.timestamp = (new Date()).getTime();
    
    this.isSelected = false;
    this.inputTitle = false;
    this.inputSubtitle = false;
    this.inputDesc = false;

    this.plans = [];
}

DayModel.prototype.constructor = DayModel;
DayModel.prototype.createAPlan = function(name) {
    if (!this.plans) {
        this.plans = [];
    }

    var tempPlan = new PlanModel(name);
    this.plans.push(tempPlan);
    return tempPlan;
}

module.exports = DayModel;