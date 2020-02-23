<template>
  <div class="menu h-12 bg-primary flex flex-row items-center px-6">
    <unicon :name="mainButtonIcon" class="mr-3 border p-2 rounded-lg transition-colors hover:bg-secondary home-button" height="20" @click="mainButtonHandler" width="20"></unicon>
    <board-list></board-list>
    <div class="flex-grow"></div>
    <user-popover></user-popover>
  </div>
</template>
<script>
import BoardList from './BoardList.vue';
import UserPopover from './UserPopover.vue';

export default {
  components: { BoardList, UserPopover },
  computed: {
    mainButtonIcon() {
      if (this.$route.name === 'note') return 'arrow-left';
      else return 'home-alt';
    },
  },
  methods: {
    mainButtonHandler() {
      this.$store.commit('ui/update', {
        key: 'activeHomePage',
        value: 'board-list',
      });
      this.$router.push(this.$route.name === 'note' ? '/board' : '/');
    },
  },
};
</script>
<style>
.home-button {
  @apply border-blue-600;
  color: white;
  cursor: pointer;
}
</style>
