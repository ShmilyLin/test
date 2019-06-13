import Vue from 'vue';
import App from './App.vue';
// import router from './router'
// import store from './store'
// const {
//   remote
// } = window.require('electron');
// const path = window.require('path');
import DatabaseManager from '../../libs/SQLite3/index.js';

Vue.config.productionTip = false

// console.log(path.join(remote.app.getPath('userData'), 'data/card.db'));
const CardDB = new DatabaseManager('data/card.db');

CardDB.CreateDatabase((next) => {
  console.log("【Main】 可以更新数据库");
  next();
}, (error) => {
  if (error) {

  }else {
    console.log("【Main】 创建数据库完成");
    CardDB.CreateTable('HOTELCARD', {
      id: {
        Type: Number,
        NotNull: true,
        PrimaryKey: true,
        Unioue: true,
        // Check: "",
        // Index: "",
        AutoIncrement: true,
        // Default: "",
      },
      name: {
        Type: String,
        NotNull: true,
      },
      address: {
        Type: Object,
        Sub: {
          country: { Type: String },
          province: { Type: String },
          city: { Type: String },
          district: { Type: String },
          content: { Type: String },
          desc: { Type: String },
          longitude: { Type: "REAL" },
          latitude: { Type: "REAL" },
        }
      },
      type: { Type: String }, // 酒店类型（民宿、快捷酒店、公寓、星级酒店、短租、长租、廉价酒店、旅社、招待所、疗养院）
      desc: { Type: String },
      rooms: { Type: Array },
      // group: { },
      // tags: { }
    }, (msg) => {
      if (msg) {
        console.log("【Main】 创建表失败");
      }else {
        console.log("【Main】 创建表成功");
      }
    })
  }
});

Vue.prototype.$CardDB = CardDB;


new Vue({
//   router,
//   store,
  render: h => h(App)
}).$mount('#app')
