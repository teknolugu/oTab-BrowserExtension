<template>
  <div class="empty-item d-flex pa-5 align-center justify-center flex-column">
    <div class="empty-item--icon background">
      <v-icon>{{ icon }}</v-icon>
    </div>
    <div class="empty-item--content mt-3">
      <span class="subtitle-1 font-weight-medium grey--text">{{ title }}</span>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'mdi-note-outline',
    },
  },
};
</script>
<style lang="scss">
.empty-item {
  &--icon {
    padding: 15px;
    border-radius: 30px;
    .v-icon {
      font-size: 30px !important;
    }
  }
}
</style>
