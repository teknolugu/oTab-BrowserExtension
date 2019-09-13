<template>
  <v-card class="home-tab-card" min-height="30px" width="125px" hover :title="tab.title" :href="tab.url">
    <v-card-title class="py-3 pb-0">
      <div class="mx-auto tab-favicon background pa-3" style="border-radius: 50px">
        <v-img contain :src="tab.favIconUrl" height="30px" width="30px"></v-img>
      </div>
    </v-card-title>
    <v-card-text class="py-4">
      <p class="ma-0 text-truncate subtitle-2 text-center">{{ tab.title }}</p>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    tab: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        favIconUrl: '',
        url: '',
      }),
    },
  },
};
</script>
<style lang="scss">
.home-tab-card {
  border-radius: 4px;
  margin-left: 12px;
  &:first-child {
    margin-left: 0;
  }
}
</style>
