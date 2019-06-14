import Vue from 'vue'
import Vuex from 'vuex'
import Global from './utils/Global.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autoSave: false, // 是否自动保存
    autoShowRightSidebar: false, // 是否自动显示隐藏右边栏

    dayList: [], // 天 列表
    // dayList: {}, // 天 列表
    // dayListCount: 0,

    currentSelected: { // 当前选中的 天 计划 项
      dayIndex: -1,
      planIndex: -1,
      planListItemIndex: -1,
    },

    rightInfo: null,
  },
  mutations: {
    [Global.Store.MutationsKeys.SetAutoSave](state, status) {
        state.autoSave = status;
    },
    [Global.Store.MutationsKeys.SetAutoShowRightSidebar](state, status) {
      state.autoShowRightSidebar = status;
    },


    [Global.Store.MutationsKeys.SetDayList](state, theList) {
      state.dayList = theList;
      // if (theList) {
      //   var tempList = {};
      //   for (var tempKey in theList) {
      //     tempList[tempKey] = theList[tempKey];
      //   }

      //   state.dayList = tempList;
      //   state.dayListCount = theList.length - 1;
      // }else {
      //   state.dayList = {};
      // }
    },
    [Global.Store.MutationsKeys.AddDayListItem](state, theItem) {
      if (theItem) {
        state.dayList.push(theItem);
        // state.dayList = {}
      }
    },
    [Global.Store.MutationsKeys.InsertDayListItem](state, params) {
      if (params.item) {
        if ("start" in params && params.start != undefined && params.start != null) {
          state.dayList.splice(params.start, 0, params.item);
        }else {
          state.dayList.push(params.item);
        }
      }
    },
    [Global.Store.MutationsKeys.DeleteDayListItem](state, index) {
      if (index >= 0 && state.dayList.length > 0 && index < state.dayList.length) {
        state.dayList.splice(index, 1, );
      }
    },
    [Global.Store.MutationsKeys.ModifiedDayListItem](state, params) {
      if (params.item && params.index >= 0 && state.dayList.length > 0 && params.index < state.dayList.length) {
        state.dayList.splice(params.index, 1, Object.assign({}, params.item));
        // Vue.set(state.dayList, params.index, params.item);
      }
    },

    [Global.Store.MutationsKeys.ModifiedData](state, params) {
      if (params.target && params.item && params.index >= 0) {
        Vue.set(GetVueSetTarget(state, params.target), params.index, params.item);
      }
    },


    [Global.Store.MutationsKeys.CancelSelectedDayListItem](state, params) {
      var tempDayIndex = state.currentSelected.dayIndex;
      var tempPlanIndex = state.currentSelected.planIndex;
      var tempPlanListItemIndex = state.currentSelected.planListItemIndex;

      if (tempDayIndex >= 0 && state.dayList.length > tempDayIndex) {
        var tempDayItem = state.dayList[tempDayIndex];
        if (params.dayIndex != tempDayIndex) {
          tempDayItem.isSelected = false;
        }
        
        if (tempPlanIndex >= 0 && tempDayItem.plans[tempPlanIndex]) {
          var tempPlanItem = tempDayItem.plans[tempPlanIndex];
          if (params.planIndex != tempPlanIndex || params.dayIndex != tempDayIndex) {
            tempPlanItem.isSelected = false;
          }
          
          if (tempPlanListItemIndex >= 0 && tempPlanItem.list[tempPlanListItemIndex]) {
            if (params.planListItemIndex != tempPlanListItemIndex || params.planIndex != tempPlanIndex || params.dayIndex != tempDayIndex) {
              var tempPlanListItem = tempPlanItem.list[tempPlanListItemIndex];
              tempPlanListItem.isEditor = false;
            }
          }
        }

        Vue.set(state.dayList, tempDayIndex, tempDayItem);
      }

      state.currentSelected.dayIndex = params.dayIndex;
      state.currentSelected.planIndex = params.planIndex;
      state.currentSelected.planListItemIndex = params.planListItemIndex;
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