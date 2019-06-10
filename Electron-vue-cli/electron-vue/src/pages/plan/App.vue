<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
const {
    ipcRenderer,
    remote
} = window.require('electron');

export default {
  name: "App",
  created: function () {
    var currentWebContents = remote.getCurrentWebContents();
    currentWebContents.openDevTools({
      mode: "detach"
    });
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
