<template>
  <nav class="height-with-menu side-menu left-0 bg-gray-200 absolute py-5" :class="{ hide: hideSideMenu }">
    <transition enter-active-class="slideInLeft" leave-active-class="slideOutLeft" mode="out-in">
      <component :is="sideMenuComponent"></component>
    </transition>
    <unicon
      name="angle-left"
      class="rounded-full shadow-xl bg-card p-2 cursor-pointer absolute duration-200 right-0 top-0 mt-4"
      :class="[hideSideMenu ? '-mr-12 rotate-icon-180' : '-mr-5']"
      @click.native="$store.commit('ui/update', { key: 'hideSideMenu', value: !hideSideMenu })"
    ></unicon>
  </nav>
</template>
<script>
import OpenTabs from '../board/TheOpenTabs.vue';
import SettingsList from '../home/TheSettingsList.vue';
import NoteList from '../note/TheNoteList.vue';

export default {
  components: { OpenTabs, SettingsList, NoteList },
  computed: {
    hideSideMenu() {
      return this.$store.state.ui.hideSideMenu;
    },
    sideMenuComponent() {
      switch (this.$route.name) {
        case 'board':
          return 'open-tabs';
        case 'home':
          return 'settings-list';
        case 'note':
          return 'note-list';
      }
    },
  },
};
</script>
<style>
.side-menu {
  transition: all 0.7s ease;
  width: 300px;
}
.side-menu.hide {
  transform: translateX(-300px);
}
</style>
