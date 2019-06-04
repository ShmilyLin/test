const PlanListItemModel = require("./PlanListItemModel.js");

function PlanModel(name) {
    this.name = name ? name : "计划",
    this.isSelected = false;
    this.timestamp = (new Date()).getTime();
    this.inputName = false;
    this.list = []
}

PlanModel.prototype.constructor = PlanModel;
PlanModel.prototype.createAListItem = function(type, params) {
    if (!this.list) {
        this.list = [];
    }

    var tempItem = new PlanListItemModel(type, params);
    this.list.push(tempItem);
    return tempItem;
}

module.exports = PlanModel;