<template>
  <v-container fluid class="fill-height" style="width: 100%">
    <board-manager></board-manager>
    <home></home>
    <auth></auth>
    <settings></settings>
    <keep-alive>
      <component :is="components[activeMenu]"></component>
    </keep-alive>
  </v-container>
</template>
<script>
import SaveData from '../../mixins/save-data';

import Settings from '../components/settings/settings';
import BoardManager from '../components/board-manager';
import Home from '../components/home/home';
import Auth from '../components/auth';

import Collections from './collections';
import Notes from './notes';
import Tasks from './tasks';

export default {
  components: { Notes, Collections, Tasks, BoardManager, Settings, Home, Auth },
  mixins: [SaveData],
  computed: {
    activeMenu() {
      return this.$store.state.activeMenu;
    },
  },
};
</script>
