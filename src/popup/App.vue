<template>
  <div class="bg-gray-100 popup" v-if="retrieved">
    <the-menu></the-menu>
  </div>
</template>
<script>
import TheMenu from './components/TheMenu.vue';

export default {
  components: { TheMenu },
  data: () => ({
    retrieved: false,
  }),
  created() {
    this.$store.watch(
      state => state.settings.dark,
      function(value) {
        document.querySelector('body').classList = value ? 'dark-theme' : 'light-theme';
      }
    );

    this.$store.dispatch('retrieveData').then(() => (this.retrieved = true));
    console.log(this.$store);
  },
};
</script>
<style>
.popup {
  height: 450px;
  width: 320px;
}
</style>
