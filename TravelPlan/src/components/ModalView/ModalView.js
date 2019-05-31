Vue.component('modal-view', {
    template: "#modal-view",
    props: {
      content: {
        type: String,
        default: "",
      },
      showCancel: {
          type: Boolean,
          default: false,
      },
      cancelText: {
          type: String,
          default: "取消"
      },
      confirmText: {
        type: String,
        default: "确定"
      }
    },
    data () {
        return {
        }
    },
    methods: {
        cancelButtonClickEvent: function () {
            this.$emit('cancel-click');
        },
        confirmButtonClickEvent: function () {
            this.$emit('confirm-click');
        }
    },
})