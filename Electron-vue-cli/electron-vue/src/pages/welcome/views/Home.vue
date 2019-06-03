<template>
  <div class="home">
    <Header></Header>
	  <div class="section">
      <div class="section-left">
        <div class="section-left-title">最近使用</div>
        <ul class="section-left-list">
          <template v-if="fileList && fileList.length > 0">
            <li class="section-left-list-item" v-for="fileItem in fileList" :key="fileItem.fileId">
              <div class="section-left-list-item-name">{{fileItem.name}}</div>
              <div class="section-left-list-item-path" v-if="fileItem.type===1">{{fileItem.path}}</div>
            </li>
          </template>
          <template v-else>
            <li class="section-left-list-none" @click="createAPlanButtonClickEvent">创建旅行计划</li>
          </template>
        </ul>
      </div>
      <div class="section-right">

      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/pages/welcome/components/Header.vue';
import Footer from '@/pages/welcome/components/Footer.vue';

export default {
	name: 'home',
	components: {
		Header,
		Footer
	},
	data() {
        return {
			platform: "", // 平台

            fileList: [],
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
    createAPlanButtonClickEvent: function () {
      var currentWindow = remote.getCurrentWindow();

      if (window.process.env.runtype === 'dev') {
          currentWindow.loadURL('http://localhost:8080/plan.html');
      }else {
          currentWindow.loadFile('dist/plan.html');
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

.section {
    padding: 20px;
    width: calc(100% - 40px);
    display: flex;
    flex-direction: row;
    height: calc(100% - 40px - 50px - 20px - 20px - 30px - 20px - 1px - 40px);
}

.section-left {
    width: calc(300px - 20px);
    padding-right: 20px;
    border-right: 1px solid lightgray;
    height: 100%;
}

.section-left-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    border-bottom: 1px solid lightgray;
}

.section-left-list {
    width: 100%;
    height: calc(100% - 30px - 1px);
}

.section-left-list-item {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.section-left-list-item-name {
    font-size: 16px;
    line-height: 1;
}

.section-left-list-item-path {
    font-size: 14px;
    line-height: 1;
    font-weight: 300;
}

.section-left-list-none {
    padding: 15px 0;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    color: #FF6F61;
}

.section-right {
    width: calc(1005 - 300px - 1px);
}
</style>
