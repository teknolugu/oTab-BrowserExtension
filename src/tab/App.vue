<template>
  <div class="bg-gray-100 h-screen  relative text-gray-700 overflow-hidden">
    <the-menu></the-menu>
    <div class="height-with-menu main-content relative h-full transition-750" :class="{ 'hide-side-menu': !$store.state.hideSideMenu }" v-if="retrieved">
      <the-side-menu></the-side-menu>
      <router-view></router-view>
    </div>
    <base-dialog></base-dialog>
  </div>
</template>

<script>
import TheMenu from './components/layout/TheMenu/index.vue';
import TheSideMenu from './components/layout/TheSideMenu.vue';
import BaseDialog from './components/ui/BaseDialog.vue';
import Board from '../store/models/board';
import Column from '../store/models/column';

export default {
  components: { TheMenu, TheSideMenu, BaseDialog },
  data() {
    return {
      retrieved: false,
    };
  },
  created() {
    // this.$router.push('/board')
    this.retrieved = true;
    console.log(this.$store);
  },
};
</script>
<style>
.main-content.hide-side-menu {
  padding-left: 300px;
}
</style>
