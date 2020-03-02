<template>
  <div class="app">
    <template v-if="retrieved">
      <empty-board v-if="boards.length === 0"></empty-board>
      <template v-else>
        <the-menu></the-menu>
        <div class="height-with-menu main-content relative h-full duration-700" :class="{ 'hide-side-menu': !$store.state.ui.hideSideMenu }">
          <the-side-menu></the-side-menu>
          <router-view></router-view>
        </div>
      </template>
      <base-dialog></base-dialog>
    </template>
    <p class="text-xl text-center text-default-soft mt-4" v-else>Loading...</p>
  </div>
</template>

<script>
import TheMenu from './components/layout/TheMenu/index.vue';
import TheSideMenu from './components/layout/TheSideMenu.vue';
import EmptyBoard from './components/layout/TheEmptyBoard.vue';
import BaseDialog from '@/BaseComponents/BaseDialog.vue';

export default {
  components: { TheMenu, TheSideMenu, BaseDialog, EmptyBoard },
  data() {
    return {
      retrieved: false,
    };
  },
  computed: {
    boards() {
      return this.$store.getters['boards/getAllBoards'];
    },
    isDark() {
      return this.$store.state.settings.dark;
    },
  },
  created() {
    this.$browser.storage.local.get('test').then(data => console.log(data));
    // this.$browser.storage.local.clear()
    this.$store.watch(
      state => state.settings.dark,
      function(value) {
        const body = document.querySelector('body');
        body.classList = value ? 'dark-theme' : 'light-theme';
      }
    );
    this.$store.dispatch('retrieveData').then(data => {
      this.retrieved = true;

      if (data && !!data.defaultBoard) this.$router.push('/board');
    });

    this.$browser.storage.onChanged.addListener(async changes => {
      const { active } = await this.$browser.tabs.getCurrent();
      if (active) return;

      Object.keys(changes).forEach(key => {
        this.$store.commit('changeModules', {
          key,
          value: changes[key].newValue,
        });
      });
    });
  },
};
</script>
<style>
.app {
  @apply bg-gray-100 h-screen relative text-default overflow-hidden;
}
.input-first-board {
  @apply text-3xl !important;
}
.main-content.hide-side-menu {
  padding-left: 335px;
}
.content-wrapper {
  @apply pl-16 pr-6 pt-6 pb-4;
}
.hide-side-menu .content-wrapper {
  @apply pl-0 !important;
}
</style>
