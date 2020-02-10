<template>
  <div class="menu h-12 bg-blue-500 flex flex-row items-center px-6">
    <unicon name="home-alt" class="mr-3 border p-2 rounded transition-bg hover:bg-blue-600 home-button" height="20" width="20"></unicon>
    <board-list></board-list>
  </div>
</template>
<script>
import BoardList from './BoardList.vue';

export default {
  components: { BoardList },
};
</script>
<style>
.home-button {
  @apply border-blue-600;
  color: white;
  cursor: pointer;
}
</style>
