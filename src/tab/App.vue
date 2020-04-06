<template>
  <div class="app h-screen">
    <template v-if="retrieved">
      <empty-board v-if="boards.length === 0"></empty-board>
      <template v-else>
        <div class="flex h-full relative duration-700">
          <side-menu></side-menu>
          <side-content v-model="hideSideMenu"></side-content>
          <main class="overflow-auto pl-12 pr-8 pt-8 main-content flex-grow" :class="{ 'hide-side-menu': hideSideMenu }">
            <router-view></router-view>
          </main>
        </div>
      </template>
      <base-dialog></base-dialog>
    </template>
    <p class="text-xl text-center text-default-soft pt-4" v-else>Loading...</p>
  </div>
</template>

<script>
import SideMenu from './components/layout/SideMenu/index.vue';
import SideContent from './components/layout/SideContent.vue';
import EmptyBoard from './components/layout/TheEmptyBoard.vue';
import BaseDialog from '~/BaseComponents/BaseDialog.vue';

export default {
  components: { SideMenu, SideContent, BaseDialog, EmptyBoard },
  data() {
    return {
      hideSideMenu: false,
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
  metaInfo() {
    return {
      title: 'New Tab',
      titleTemplate: '%s - oTab',
    };
  },
};
</script>
<style lang="scss">
.app {
  @apply bg-gray-100 relative text-default;
}
.input-first-board {
  @apply text-3xl #{!important};
}
.main-content {
  width: calc(100vw - 22.75rem);
  &.hide-side-menu {
    width: calc(100vw - 5rem);
  }
}
.hide-side-menu .content-wrapper {
  @apply pl-0 #{!important};
}
</style>
