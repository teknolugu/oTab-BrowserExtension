<template>
  <v-dialog transition="slide-y-transition" v-model="visible" fullscreen content-class="custom-fullscreen-dialog">
    <v-card height="100%" color="background">
      <div :style="{ background: 'url(' + checkUrl(backgroundImage.url) + ') center center / cover no-repeat', height: '100%' }">
        <v-container fill-height fluid class="d-inline-block" style="background-color: #00000029">
          <div class="home-header d-flex align-center justify-space-between">
            <p class="headline ma-0 black--text" style="filter: invert(1);">
              <span style="margin-right: -10px">o</span>
              <span class="font-weight-bold">Tab</span>
            </p>
            <v-btn depressed small @click="visible = false" color="primary">
              <v-icon left>{{ $icons.mdiApps }}</v-icon>
              <span class="capitalize">Apps</span>
            </v-btn>
          </div>
          <div class="home-content d-flex align-center flex-column justify-center">
            <div class="search-content">
              <v-text-field
                v-model="textSearch"
                v-show="$store.state.settings.items.searchBar"
                @click:prepend-inner="search"
                @keyup.enter="search"
                placeholder="Type to search..."
                solo
                :prepend-inner-icon="$icons.mdiMagnify"
              ></v-text-field>
            </div>
            <div class="home-tab mt-5 pb-5 d-flex flex-row">
              <template v-for="tab in tabs">
                <tab-card :tab="tab"></tab-card>
              </template>
              <v-btn absolute depressed @click="clearTabs" small color="error" bottom right>
                Clear Tabs
              </v-btn>
            </div>
          </div>
          <v-btn @click="selectThemeSheet = !selectThemeSheet" absolute bottom left icon color="#ffffffd1" class="edit-button" outlined>
            <v-icon>{{ $icons.mdiPencil }}</v-icon>
          </v-btn>
          <v-btn @click="openSettings" absolute bottom right icon color="#ffffffd1" class="edit-button">
            <v-icon>{{ $icons.mdiPencil }}</v-icon>
          </v-btn>
        </v-container>
      </div>
    </v-card>
    <select-theme :activator="selectThemeSheet"></select-theme>
  </v-dialog>
</template>
<script>
import Bus from '../../utils/bus';
import TabCard from './tab-card';
import SelectTheme from './select-theme';

export default {
  components: { TabCard, SelectTheme },
  data: () => ({
    selectThemeSheet: false,
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
      if (url) return url.slice(0, 4) === 'http' ? `${url}?auto=compress&cs=tinysrgb&dpr=2&h=1920&w=1080` : url;
    },
    clearTabs() {
      this.$store.commit('homeCollection', '');
      this.$browser.storage.sync.set({ homeCollection: '' });
    },
    openSettings() {
      Bus.$emit('settings');
    },
    search() {
      const { searchEngine } = this.$store.state.settings.items;
      window.open(`${this.searchEnginesUrl[searchEngine]}${this.textSearch}`, '_self');
    },
  },
  computed: {
    backgroundImage() {
      return this.$store.state.settings.items.homeBackground;
    },
    tabs() {
      const { state } = this.$store;
      if (state.homeCollection !== '') {
        const getId = state.homeCollection.split('=>');
        if (typeof state.collections.items[getId[0]][getId[1]] === 'undefined') {
          this.$browser.storage.sync.set({ homeCollection: '' });
          this.$store.commit('homeCollection', '');
          return [];
        }
        return state.collections.items[getId[0]][getId[1]].tabs.slice(0, 5);
      }
      return [];
    },
  },
  created() {
    Bus.$on('home', () => (this.visible = true));
    this.visible = this.$store.state.settings.items.home;
  },
};
</script>
<style lang="scss">
.home-tab {
  position: relative;
  .v-btn {
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s ease;
    margin-bottom: -25px;
  }
  &:hover {
    .v-btn {
      visibility: visible;
      opacity: 1;
      transform: translateY(10px);
    }
  }
}
.home-header {
  height: 40px;
}
.home-content {
  height: calc(100% - 50px);
  width: 100%;
  .search-content {
    margin-top: 100px;
    width: 43%;
    min-width: 300px;
  }
}
</style>
