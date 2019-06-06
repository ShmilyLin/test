<template>
  <div id="app">
    <CreateHotelCard></CreateHotelCard>
  </div>
</template>

<script>
import CreateHotelCard from './components/CreateHotelCard.vue';

export default {
    name: "App",
    components: {
        CreateHotelCard
    }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
