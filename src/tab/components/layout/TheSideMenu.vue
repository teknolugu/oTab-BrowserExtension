<template>
  <nav class="height-with-menu side-menu left-0 bg-gray-200 absolute transition-transform transition-750 py-5" :class="{ hide: hideSideMenu }">
    <component :is="sideMenuComponent"></component>
    <unicon
      name="angle-left"
      class="rounded-full shadow-xl bg-white p-2 cursor-pointer absolute transition-250 right-0 top-0 mt-4"
      :class="[hideSideMenu ? '-mr-12 rotate-icon-180' : '-mr-5']"
      @click.native="$store.commit('hideSideMenu')"
    ></unicon>
  </nav>
</template>
<script>
import OpenTabs from '../board/TheOpenTabs';
import SettingsList from '../index/TheSettingsList';

export default {
  components: { OpenTabs, SettingsList },
  computed: {
    hideSideMenu() {
      return this.$store.state.hideSideMenu;
    },
    sideMenuComponent() {
      switch (this.$route.name) {
        case 'board':
          return 'open-tabs';
        case 'index':
          return 'settings-list';
      }
    },
  },
};
</script>
<style>
.side-menu {
  width: 300px;
}
.side-menu.hide {
  transform: translateX(-300px);
}
</style>
