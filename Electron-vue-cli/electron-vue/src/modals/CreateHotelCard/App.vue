<template>
  <div id="app">
    <CreateHotelCard></CreateHotelCard>
  </div>
</template>

<script>
const {
    remote
} = window.require('electron');
import CreateHotelCard from './components/CreateHotelCard.vue';

export default {
	name: "App",
	components: {
		CreateHotelCard
	},
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
