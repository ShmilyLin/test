<template>
	<div class="home">
		<div class="home-top">
			<TopMenu :topToolMode="topToolMode" @top-tool-mode="topMenuToolModeChangeEvent"></TopMenu>
			<transition name="tools">
                <TopTools v-if="topToolMode === 0 || showTopTools"></TopTools>
            </transition>
		</div>
		<div class="">
			<div class=""></div>
			<RightSidebar></RightSidebar>
		</div>
		<Footer></Footer>
	</div>
</template>

<script>
import TopMenu from '@/pages/plan/components/TopMenu.vue';
import TopTools from '@/pages/plan/components/TopTools.vue';
import RightSidebar from '@/pages/plan/components/RightSidebar.vue';
import Footer from '@/pages/plan/components/Footer.vue';

export default {
	name: 'home',
	components: {
		TopMenu,
		TopTools,
		Footer
	},
	data() {
        return {
			platform: "", // 平台

			topToolMode: 0, // 工具栏显示模式，0为工具栏始终显示，1为工具栏鼠标悬停显示
			showTopTools: false, // 当topToolMode为1时，是否显示顶部工具栏
        }
    },
	created: function () {
		if (window.process.platform === "darwin") {
            this.platform = "mac";
        }else if (window.process.platform.indexOf('win') >= 0) {
            this.platform = "win";
		}
	},
	methods: {
		/**
		 * 顶部工具栏显示状态改变
		 */
		topMenuToolModeChangeEvent: function () {
			if (this.topToolMode === 1) {
				this.topToolMode = 0;
			}else {
				this.topToolMode = 1;
			}
		}
	}
}
</script>


<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
}


</style>
