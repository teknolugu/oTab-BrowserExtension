<template>
  <v-app id="#app">
    <template v-if="$store.state.isLoaded">
      <Menu v-show="$store.state.boards.length !== 0"></Menu>
      <v-content>
        <template v-if="$store.state.boards.length !== 0">
          <main-app></main-app>
        </template>
        <template v-else>
          <empty-item :icon="$icons.developerBoard">
            <p class="subtitle-2">
              You have no board, click
              <v-icon @click="newBoard" style="border-radius: 30px; cursor: pointer;" class="pa-1 pink white--text elevation-2 mx-1">{{ $icons.mdiPlus }}</v-icon> button to create
              new one
            </p>
          </empty-item>
        </template>
      </v-content>
    </template>
    <v-progress-circular indeterminate color="primary" class="mx-auto mt-4" v-else></v-progress-circular>
  </v-app>
</template>
<script>
import Menu from './components/menu/menu';
import MainApp from './views/main-app';
import EmptyItem from './components/empty-item';
import Bus from './utils/bus';

export default {
  components: {
    MainApp,
    Menu,
    EmptyItem,
  },
  watch: {
    activeBoard(val) {
      Bus.$emit('changeBoard', val);
    },
  },
  data: () => ({
    isEmpty: false,
  }),
  methods: {
    async newBoard() {
      const result = await this.$dialog.prompt({
        text: 'Board name',
        title: 'Please input board name',
      });
      if (typeof result === 'string') {
        this.$store.dispatch('createNewBoard', result).catch(message => {
          this.$dialog.notify.error(message);
        });
      }
    },
  },
  computed: {
    activeBoard() {
      return this.$store.state.activeBoard;
    },
    allData() {
      return this.$store.getters.allData;
    },
  },
  async created() {
    const { lastBackup } = await browser.storage.sync.get('lastBackup');
    this.sendMessage('getUser').then(user => {
      if (user) {
        this.$store.commit('changeUser', { ...user });
        this.$store.commit('changeBoolean', { key: 'isLogin', data: true });
      }
    });
    // Initialize all data
    this.$store.dispatch('initData');
    // set theme
    this.$browser.storage.sync.get('oTabSettings').then(settings => {
      this.$vuetify.theme.dark = settings.oTabSettings.dark;
    });
  },
};
</script>
<style lang="scss">
.overflow-y-hidden {
  overflow-y: hidden;
}
.v-menu__content {
  border-radius: 4px !important;
}
</style>
