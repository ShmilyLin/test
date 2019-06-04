<template>
    <div class="switch-button" :class="{ 'switch-button-selected': isSwitch }">
        <div class="switch-button-ball" :class="{ 'switch-button-ball-selected ': isSwitch }"></div>
    </div>
</template>

<script>

export default {
    name: 'SwitchButton',
    props: {
      isSwitch: {
        type: Boolean,
        default: false,
      }
    },
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>
.switch-button {
    border: 1px solid lightgray;
    border-radius: 9px;
    height: 16px;
    width: 30px;
    transition: all 0.5s;
    background-color: #f2f2f2;
    cursor: pointer;
}

.switch-button-selected {
    border: 1px solid #FF6F61;
    background-color: #FF6F61;
}

.switch-button-ball {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    margin-left: 2px;
    transition: all 0.5s;
    margin-top: 2px;
    background-color: white;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);
}

.switch-button-ball-selected {
    margin-left: calc(30px - 2px - 12px);
    box-shadow: none;
}
</style>