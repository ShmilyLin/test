import Vue from 'vue'
import Vuex from 'vuex'
import Global from './utils/Global.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    autoSave: false, // 是否自动保存
  },
  mutations: {
    [Global.Store.MutationsKeys.SetAutoSave](state, params) {
        state.autoSave = params;
    }
  },
  actions: {

  }
})
