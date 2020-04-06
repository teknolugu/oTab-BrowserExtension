<template>
  <div class="menu h-full w-16 bg-primary flex flex-col items-center py-8">
    <user-popover class="mb-16"></user-popover>
    <unicon :name="mainButtonIcon" class="home-button" v-tooltip.right="$route.name === 'note' ? 'Go back' : 'Home'" @click="mainButtonHandler"></unicon>
    <board-list class="my-6"></board-list>
    <unicon name="cog" class="home-button" v-tooltip.right="'Settings'" @click="$router.push('/home/preferences')"></unicon>
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
      return 'home-alt';
    },
  },
  methods: {
    mainButtonHandler() {
      this.$router.push(this.$route.name === 'note' ? '/board' : '/');
    },
  },
};
</script>
<style scoped lang="scss">
.menu {
  z-index: 1;
}
.home-button {
  @apply border-blue-600 p-2 rounded-lg;
  color: white;
  cursor: pointer;
  &:hover {
    @apply bg-secondary;
  }
}
</style>
