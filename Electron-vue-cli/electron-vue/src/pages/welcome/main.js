import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
Vue.config.devtools = process.env.NODE_ENV === 'development';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
