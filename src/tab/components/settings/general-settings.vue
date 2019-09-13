<template>
  <div>
    <v-subheader>Home Screen</v-subheader>
    <v-card class="mx-4">
      <v-list class="py-0">
        <v-list-item>
          <v-list-item-content>
            <span class="font-weight-regular subtitle-2">Search Engines</span>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            <v-select hide-details outlined class="select-search-engine" :items="searchEngineList" :value="settings.searchEngine" @change="changeSearchEngine"></v-select>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <span class="font-weight-regular subtitle-2">Show Search bar</span>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch v-model="showSearchBar" color="primary"></v-switch>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <span class="font-weight-regular subtitle-2">Always Open Home Screen Every New Tab</span>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch color="primary" v-model="alwaysOpenHome"></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
    <v-subheader class="mt-2">Preferences</v-subheader>
    <v-card class="mx-4">
      <v-list class="py-0">
        <v-list-item>
          <v-list-item-content>
            <span class="font-weight-regular subtitle-2">Themes</span>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn-toggle color="primary" mandatory @change="darkMode" :value="settings.dark">
              <v-btn small active-class="primary" :value="false">Light</v-btn>
              <v-btn small active-class="primary" :value="true">Dark</v-btn>
            </v-btn-toggle>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <span class="font-weight-regular subtitle-2">Open Collection Tab In Current Tab</span>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch v-model="openInCurrentTab" color="primary"></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    settings: Object,
  },
  data: () => ({
    searchEngineList: ['google', 'bing', 'duckduckgo', 'yandex'],
  }),
  computed: {
    openInCurrentTab: {
      set(value) {
        this.emitChange('openInCurrentTab', value);
      },
      get() {
        return this.$props.settings.openInCurrentTab;
      },
    },
    showSearchBar: {
      set(value) {
        this.emitChange('searchBar', value);
      },
      get() {
        return this.$props.settings.searchBar;
      },
    },
    alwaysOpenHome: {
      set(value) {
        this.emitChange('home', value);
      },
      get() {
        return this.$props.settings.home;
      },
    },
  },
  methods: {
    emitChange(key, value) {
      this.$emit('change', { key, value });
    },
    changeSearchEngine(searchEngine) {
      this.emitChange('searchEngine', searchEngine);
    },
    darkMode(value) {
      this.$vuetify.theme.dark = value;
      this.emitChange('dark', value);
    },
  },
};
</script>
<style lang="scss">
.select-search-engine {
  .v-select__selections {
    text-transform: capitalize;
  }
  .v-input__append-inner {
    margin-top: 3px !important;
  }
  .v-input__control {
    height: 30px;
    font-size: 14px;
    width: 170px !important;
    .v-input__slot {
      min-height: 30px;
    }
  }
}
</style>
