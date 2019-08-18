<template>
  <div class="general-settings">
    <p class="list-subtitle">Home screen</p>
    <div class="el-list settings">
      <div class="el-list-item settings">
        <div class="el-list-icon right">
          <el-select size="mini" @change="changeSearchEngine" :value="settings.searchEngine" class="select-search-engine">
            <el-option class="capitalize" v-for="searchEngine in searchEngineList" :key="searchEngine" :value="searchEngine" :label="searchEngine"></el-option>
          </el-select>
        </div>
        <div class="el-list-text">
          <p>Search engine</p>
        </div>
      </div>
      <div class="el-list-item settings">
        <div class="el-list-icon right">
          <el-switch :value="settings.searchBar" @change="showSearchBar"></el-switch>
        </div>
        <div class="el-list-text">
          <p>Show search bar</p>
        </div>
      </div>
      <div class="el-list-item settings">
        <div class="el-list-icon right">
          <el-switch :value="settings.home" @change="alwaysOpenHome"></el-switch>
        </div>
        <div class="el-list-text">
          <p>Always open <b>Home Screen</b> every new tab</p>
        </div>
      </div>
    </div>
    <p class="list-subtitle">Preferences</p>
    <div class="el-list settings">
      <div class="el-list-item settings">
        <div class="el-list-icon right">
          <el-radio-group size="mini" @change="darkMode" v-model="dark">
            <el-radio-button :label="false">Light</el-radio-button>
            <el-radio-button :label="true">Dark</el-radio-button>
          </el-radio-group>
        </div>
        <div class="el-list-text">
          <p>Themes</p>
        </div>
      </div>
      <div class="el-list-item settings">
        <div class="el-list-icon right">
          <el-switch :value="settings.openInCurrentTab" @change="openInCurrentTab"></el-switch>
        </div>
        <div class="el-list-text">
          <p>Open collection tab in current tab</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    settings: Object,
  },
  data: () => ({
    searchEngineList: ['google', 'bing', 'duckduckgo', 'yandex'],
    dark: false,
  }),
  methods: {
    emitChange(key, value) {
      this.$emit('change', { key: key, value: value });
    },
    showSearchBar(show) {
      this.emitChange('searchBar', show);
    },
    changeSearchEngine(searchEngine) {
      this.emitChange('searchEngine', searchEngine);
    },
    alwaysOpenHome(value) {
      this.emitChange('home', value);
    },
    openInCurrentTab(value) {
      this.emitChange('openInCurrentTab', value);
    },
    darkMode() {
      this.emitChange('dark', this.dark);
      const theme = this.settings.dark ? 'Dark' : 'Light';
      this.$message(`${theme} theme will be active after you reload the tab.`);
    },
  },
  mounted() {
    this.dark = this.$props.settings.dark;
  },
};
</script>
<style lang="scss">
.select-search-engine input {
  text-transform: capitalize;
}
</style>
