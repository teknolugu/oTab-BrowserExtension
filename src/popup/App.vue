<template>
  <v-app id="app">
    <v-content>
      <ce-header :isUrl="isUrl" :board="board"></ce-header>
      <v-card class="mx-auto" max-width="330" style="margin-top: -57px;">
        <v-toolbar flat>
          <v-text-field
            :autofocus="editMode"
            hide-details
            :prepend-inner-icon="editMode ? $icons.mdiBookmarkOutline : $icons.mdiMagnify"
            :placeholder="editMode ? 'Collection name' : 'Search collections'"
            v-model="search"
          ></v-text-field>
          <v-btn
            icon
            :disabled="$store.state.boards.length === 0"
            @click="editMode = !editMode"
            class="ml-4 mr-1 background"
            :class="{ rotate45: editMode }"
            height="32px"
            width="32px"
          >
            <v-icon>{{ $icons.mdiPlus }}</v-icon>
          </v-btn>
          <v-slide-x-reverse-transition mode="out-in">
            <v-btn v-show="editMode" :disabled="collectionName === ''" icon @click="addCollection" class="ml-2 mr-1 primary" dark height="32px" width="32px">
              <v-icon>{{ $icons.mdiCheck }}</v-icon>
            </v-btn>
          </v-slide-x-reverse-transition>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text style="height: 275px; overflow-y: auto" class="scroller">
          <collection-card :search="searchValue"> </collection-card>
        </v-card-text>
        <v-card-actions>
          <actions :isUrl="isUrl"></actions>
        </v-card-actions>
      </v-card>
    </v-content>
  </v-app>
</template>
<script>
import SaveData from '../mixins/save-data';

import CeHeader from './components/header';
import CollectionCard from './components/collection-card';
import Actions from './components/actions';

export default {
  components: { CeHeader, CollectionCard, Actions },
  mixins: [SaveData],
  data: () => ({
    searchValue: '',
    isUrl: false,
    editMode: false,
    collectionName: '',
  }),
  async created() {
    const { oTabSettings } = await this.$browser.storage.sync.get('oTabSettings');
    this.$vuetify.theme.dark = oTabSettings.dark;
    this.$store.dispatch('initData');
    this.checkUrl();
  },
  methods: {
    addCollection() {
      this.searchValue = '';
      if (this.collectionName !== '') {
        this.$store.commit('collections/createCollection', { title: this.collectionName });
        this.collectionName = '';
        this.editMode = false;
      }
    },
    async checkUrl() {
      const regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      const tab = await this.$browser.tabs.query({ active: true, currentWindow: true });
      this.isUrl = regex.test(tab[0].url);
    },
  },
  computed: {
    search: {
      set(value) {
        !this.editMode ? (this.searchValue = value) : (this.collectionName = value);
      },
      get() {
        return !this.editMode ? this.searchValue : this.collectionName;
      },
    },
    allData() {
      return this.$store.getters.allData;
    },
    board() {
      return this.$store.getters.board;
    },
  },
};
</script>
<style lang="scss">
#app,
html,
body {
  overflow: hidden;
}
.rotate45 {
  transition: all 0.2s ease;
  transform: rotate(-45deg);
}
#app {
  .v-application--wrap {
    min-height: 0 !important;
  }
  width: 355px;
  height: 510px !important;
}
</style>
