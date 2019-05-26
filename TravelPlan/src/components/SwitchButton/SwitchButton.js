Vue.component('switch-button', {
    template: "#switch-button",
    props: {
      isSwitch: {
        type: Boolean,
        default: false,
      }
    },
    data () {
        return {
          
        }
    },
    watch: {
      'isSwitch': function () {
        console.log("【Switch Button】 watch isSwitch", this.isSwitch);
      }
    },
})