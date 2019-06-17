import Vue from 'vue'
import Vuex from 'vuex'
import Global from './utils/Global.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autoSave: false, // 是否自动保存
    autoShowRightSidebar: false, // 是否自动显示隐藏右边栏

    _dayList: {}, // 天 列表
    _dayListIndex: new Set(), // 天 列表索引

    currentSelected: { // 当前选中的 天 计划 项
      dayTimestamp: -1,
      planIndex: -1,
      planListItemIndex: -1,
    },

    rightInfo: null,
  },
  getters: {
    dayList(state) {
      var tempList = [];
      state._dayListIndex.forEach((value) => {
        tempList.push(state._dayList[value]);
      });
      return tempList;
    }
  },
  mutations: {
    [Global.Store.MutationsKeys.SetAutoSave](state, status) {
        state.autoSave = status;
    },
    [Global.Store.MutationsKeys.SetAutoShowRightSidebar](state, status) {
      state.autoShowRightSidebar = status;
    },


    [Global.Store.MutationsKeys.SetDayList](state, theList) {
      if (theList) {
        var tempList = {};
        var tempListSet = new Set();
        for (var i in theList) {
          if (!tempListSet.has(theList[i].timestamp)) {
            if (theList[i].plans && theList[i].plans.length) {
              var tempPlanList = {};
              var 
            }
            tempListSet.add(theList[i].timestamp);
            tempList[theList[i].timestamp] = theList[i];
          }
        }

        state._dayList = tempList;
        state._dayListIndex = tempListSet;
      }else {
        state._dayList = {};
        state._dayListIndex = new Set();
      }
    },
    [Global.Store.MutationsKeys.AddDayListItem](state, theItem) {
      if (theItem) {
        if (!state._dayListIndex.has(theItem.timestamp)) {
          state._dayListIndex.add(theItem.timestamp);
          state._dayList[theItem.timestamp] = theItem;
        }
      }
    },
    [Global.Store.MutationsKeys.InsertDayListItem](state, params) {
      if (params.item && "start" in params && params.start != undefined && params.start != null) {
        if (!state._dayListIndex.has(params.item.timestamp)) {
          if (params.start >= state._dayListIndex.size) {
            state._dayListIndex.add(params.item.timestamp);
          }else {
            var tempIndexList = Array.from(state._dayListIndex);
            tempIndexList.splice(params.start, 0, params.item.timestamp);
            state._dayListIndex = new Set(tempIndexList);
          }
          
          state._dayList[params.item.timestamp] = params.item;
        }
      }
    },
    [Global.Store.MutationsKeys.DeleteDayListItem](state, timestamp) {
      if (state._dayListIndex.size > 0) {
        state._dayListIndex.delete(timestamp);
        Vue.delete(state._dayList, timestamp);
      }
    },
    [Global.Store.MutationsKeys.ModifiedDayListItem](state, params) {
      if (params.timestamp != undefined && params.timestamp != null) {
        state._dayList[params.timestamp][params.key] = params.value;
      }
    },


    [Global.Store.MutationsKeys.CancelSelectedDayListItem](state, params) {
      var tempDayTimestamp = state.currentSelected.dayTimestamp;
      var tempPlanIndex = state.currentSelected.planIndex;
      var tempPlanListItemIndex = state.currentSelected.planListItemIndex;

      if (state._dayListIndex.has(tempDayTimestamp)) {
        var tempDayItem = state._dayList[tempDayTimestamp];
        if (params.dayTimestamp != tempDayTimestamp) {
          state._dayList[tempDayTimestamp].isSelected = false;
        }
        
        // if (tempPlanIndex >= 0 && tempDayItem.plans[tempPlanIndex]) {
        //   var tempPlanItem = tempDayItem.plans[tempPlanIndex];
        //   if (params.planIndex != tempPlanIndex || params.dayIndex != tempDayIndex) {
        //     tempPlanItem.isSelected = false;
        //   }
          
        //   if (tempPlanListItemIndex >= 0 && tempPlanItem.list[tempPlanListItemIndex]) {
        //     if (params.planListItemIndex != tempPlanListItemIndex || params.planIndex != tempPlanIndex || params.dayIndex != tempDayIndex) {
        //       var tempPlanListItem = tempPlanItem.list[tempPlanListItemIndex];
        //       tempPlanListItem.isEditor = false;
        //     }
        //   }
        // }
      }

      state.currentSelected.dayTimestamp = params.dayTimestamp;
      // state.currentSelected.planIndex = params.planIndex;
      // state.currentSelected.planListItemIndex = params.planListItemIndex;
    },

    [Global.Store.MutationsKeys.SetRightInfo](state, theInfo) {
      state.rightInfo = theInfo;
    },
  },
  actions: {

  }
})


function GetVueSetTarget(state, target) {
  var tempArray = target.split(".");
  if (tempArray.length > 0) {
    return GetVueSetTargetStep(state, tempArray);
  }
  
  return state;
}

function GetVueSetTargetStep (state, tempArray) {
  var tempStr = tempArray.shift();
  var newTarget = state[tempStr];
  if (tempArray.length > 0) {
    return GetVueSetTargetStep(newTarget, tempArray);
  }

  return newTarget;
}