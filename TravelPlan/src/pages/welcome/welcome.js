const {
    ipcRenderer
} = require('electron');

var vm = new Vue({
    el: '#app',
    data() {
        return {
            fileList: [],
        }
    },
    methods: {
        createAPlanButtonClickEvent: function () {
            console.log("【Welcome】 createAPlanButtonClickEvent");
            ipcRenderer.send('create-a-new-plan');
        }
    },
})