<template>
  <el-dialog :visible.sync="visible" fullscreen class="home-container">
    <div class="background-image" :style="{ background: 'url(' + checkUrl(backgroundImage.url) + ') center center / cover no-repeat', color: 'blue' }">
      <div class="home-dialog-inner-container">
        <div class="home-dialog-inner-container__header">
          <div class="home-title">
            <span style="font-weight: 300;" class="logo">o</span><span style="font-weight: 600;" class="logo">Tab</span>
            <el-button icon="el-icon-s-promotion" size="small" type="primary" class="app-button" @click="visible = false">App</el-button>
          </div>
        </div>
        <div class="home-dialog-inner-container__content">
          <div class="search-content" v-show="$store.state.settings.items.searchBar">
            <div class="search-input">
              <input type="text" placeholder="Type to search..." v-model="textSearch" @keyup.enter="search" />
            </div>
            <el-button type="primary" icon="el-icon-search" class="search-button" @click="search">
              <span>Search</span>
            </el-button>
          </div>
          <div class="cards-content">
            <template v-for="(tab, index) in tabs">
              <div class="home-card">
                <!-- <el-button type="text" icon="el-icon-close"></el-button> -->
                <a :href="tab.url" class="inner-card">
                  <el-image :src="tab.favIconUrl" class="favicon-image">
                    <span slot="error" class="error-favicon">
                      <i class="el-icon-picture-outline-round"></i>
                    </span>
                  </el-image>
                  <p :title="tab.title">{{ tab.title }}</p>
                </a>
              </div>
            </template>
            <el-button size="mini" type="danger" class="clear-tabs" @click="clearTabs">Clear Tabs</el-button>
          </div>
        </div>
        <el-button circle type="primary" class="customize-button" size="medium">
          <unicon name="pen" @click="openHomeSettings" style="vertical-align: bottom;" fill="white" height="20px" width="20px"></unicon>
        </el-button>
        <p class="image-author" v-show="backgroundImage.author">
          Photo by <span class="name">{{ backgroundImage.author }}</span>
        </p>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Bus from '../utils/bus';
export default {
  data: () => ({
    textSearch: '',
    searchEnginesUrl: {
      google: 'https://www.google.com/search?q=',
      bing: 'https://www.bing.com/search?q=',
      duckduckgo: 'https://duckduckgo.com/?q=',
      yandex: 'https://yandex.com/search/?text=',
    },
    visible: false,
  }),
  methods: {
    checkUrl(url) {
      return url.slice(0, 4) === 'http' ? url + '?auto=compress&cs=tinysrgb&dpr=2&h=1920&w=1080' : url;
    },
    clearTabs() {
      this.$store.commit('homeCollection', '');
      this.$browser.storage.local.set({ homeCollection: '' });
    },
    openHomeSettings() {
      Bus.$emit('settings', 'home');
    },
    search() {
      let searchEngine = this.$store.state.settings.items.searchEngine;
      window.open(`${this.searchEnginesUrl[searchEngine]}${this.textSearch}`, '_self');
    },
  },
  computed: {
    backgroundImage() {
      return this.$store.state.settings.items.homeBackground;
    },
    tabs() {
      return this.$store.getters.homeTabs;
    },
  },
  created() {
    Bus.$on('home', () => (this.visible = true));
    this.visible = this.$store.state.settings.items.home;
  },
};
</script>
<style lang="scss">
@import '../../assets/themes/themes';

$shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

.image-author {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-weight: 300;
  font-size: 13px;
  padding: 5px 10px;
  margin: 0;
  background-color: #0000003d;
  border-radius: 4px;
  color: #e3e3e3;
  border: 1px solid #2a323f;
  .name {
    font-weight: 600;
    text-transform: capitalize;
  }
}

.customize-button {
  position: absolute;
  bottom: 20px;
  background: #ffffff1c !important;
  &:hover {
    background: #409eff !important;
  }
}

.background-image {
  height: 100%;
}

.app-button {
  position: absolute;
  right: 30px;
}

.cards-content {
  .clear-tabs {
    position: absolute;
    margin: 10px;
    right: 0;
    visibility: hidden;
    transform: translateY(-10px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  &:hover {
    .clear-tabs {
      visibility: visible;
      transform: translateY(0);
      opacity: 1;
    }
  }
  position: relative;
  margin-top: 10vh;
  min-height: 40px;
  padding-bottom: 25px;
}

.error-favicon {
  font-size: 21px;
  vertical-align: text-top;
}

.home-card {
  position: relative;
  margin: 0 10px;
  background-color: white;

  .inner-card {
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    padding: 13px;
    box-sizing: border-box;
  }

  height: 120px;
  width: 120px;
  display: inline-block;
  transition: all 0.4s ease;

  border-radius: 4px;
  justify-content: center;
  box-shadow: $shadow;

  &:hover {
    box-shadow: none;

    .el-button {
      visibility: visible;
    }
  }

  p {
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    color: #303133;
  }

  .el-button {
    position: absolute;
    right: 0;
    top: 0;
    padding: 8px !important;
    visibility: hidden;
  }

  .favicon-image {
    display: block;
    margin: 0 auto;
    width: 25px;
    height: 25px;
    padding: 13px;
    border-radius: 30px;
    background-color: #f2f2f2;
  }
}

.home-container {
  .el-dialog {
    overflow: hidden !important;
    background-color: #f7f7f7;
  }
}

.search-content {
  .search-button {
    font-size: 16px;
    padding: 16px 23px !important;
    margin-left: 15px;
  }

  .search-input {
    display: inline-block;
    transition: all 0.4s ease;

    &:hover {
      box-shadow: $shadow;
    }
    border: 1px solid #dcdfe6;
    background-color: white;
    padding: 10px 15px;
    border-radius: 4px;

    input {
      width: 550px;

      color: #6f6c66;

      font-family: 'Roboto', sans-serif;
      background: transparent;
      border: none;
      outline: none;
      font-size: 16px;
      height: 30px;
    }
  }
}

.home-dialog-inner-container {
  padding: 30px 20px;
  height: 100%;
  box-sizing: border-box;
  background-color: #00000021;
  position: relative;
  &__content {
    padding: 0 !important;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}

.home-container {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    height: 100%;
    padding: 0 !important;
    box-sizing: border-box;
  }
}

.home-title {
  font-size: 24px;
  .logo {
    filter: invert(1);
  }
  @include themify($themes) {
    color: #909399;
  }
}
</style>
