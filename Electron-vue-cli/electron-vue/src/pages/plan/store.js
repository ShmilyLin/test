import Vue from 'vue'
import Vuex from 'vuex'
import Global from './utils/Global.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autoSave: false, // 是否自动保存
    autoShowRightSidebar: false, // 是否自动显示隐藏右边栏
  },
  mutations: {
    [Global.Store.MutationsKeys.SetAutoSave](state, status) {
        state.autoSave = status;
    },
    [Global.Store.MutationsKeys.SetAutoShowRightSidebar](state, status) {
      state.autoShowRightSidebar = status;
    }
  },
  actions: {

  }
})
