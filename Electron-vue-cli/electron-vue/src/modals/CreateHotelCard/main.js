import Vue from 'vue';
import App from './App.vue';
// import router from './router'
// import store from './store'
import DatabaseManager from '../../libs/SQLite3/index.js';

Vue.config.productionTip = false

const HotelCardDB = new DatabaseManager('card.db', 'HOTELCARD', {
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
      country: {
        Type: String,
      },
      province: {
        Type: String,
      },
      city: {
        Type: String,
      },
      district: {
        Type: String,
      },
      content: {
        Type: String,
      },
      desc: {
        Type: String,
      },
      longitude: {
        Type: "REAL",
      },
      latitude: {
        Type: "REAL",
      },
    }
  },
  type: {
    Type: String, // 酒店类型（民宿、快捷酒店、公寓、星级酒店、短租、长租、廉价酒店、旅社、招待所、疗养院）
  },
  desc: {
    Type: String, 
  },
  rooms: {
    Type: Array,
  },
  // group: {

  // },
  // tags: {

  // }
})

HotelCardDB.CreateDatabase((next) => {
  console.log("【Main】 可以更新数据库");
  next();
}, () => {
  console.log("【Main】 创建数据库完成");
});

Vue.prototype.$HotelCardDB = HotelCardDB;


new Vue({
//   router,
//   store,
  render: h => h(App)
}).$mount('#app')
