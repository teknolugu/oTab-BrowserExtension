<template>
  <div class="bg-card rounded-lg preferences px-5 py-4 w-full">
    <p class="text-xl mb-5 font-medium">Preferences</p>
    <list-ui v-for="setting in settingList" :key="setting.key">
      <template slot="prefix">
        <switch-ui :value="settings[setting.key]" @change="updateSetting(setting.key, $event)"></switch-ui>
      </template>
      <p class="ml-6">{{ setting.name }}</p>
    </list-ui>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    settingList: [
      { name: 'Dark theme', key: 'dark' },
      { name: 'Use oTab as default new tab', key: 'defaultNewTab' },
      { name: 'Open tab URL in new tab', key: 'openURLInNewTab' },
      { name: 'Close open tab on save', key: 'closeTabOnSave' },
    ],
  }),
  methods: {
    updateSetting(key, value) {
      this.$store.commit('settings/updateSetting', {
        key,
        value,
      });
    },
  },
  computed: mapState(['settings']),
};
</script>
<style>
.preferences .list-ui {
  cursor: auto !important;
  @apply py-4 !important;
}
</style>
