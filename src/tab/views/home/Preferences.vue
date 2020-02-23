<template>
  <div class="bg-card rounded-lg preferences px-5 py-4 w-full">
    <p class="text-xl mb-5 font-medium">Preferences</p>
    <list-ui v-for="setting in settingList" :key="setting.key">
      <unicon :name="setting.icon" :height="setting.size" :width="setting.size" slot="prefix"></unicon>
      <template slot="suffix">
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
      { name: 'Dark theme', key: 'dark', icon: 'brightness-low', size: '27' },
      { name: 'Open tab URL in new tab', key: 'openURLInNewTab', icon: 'external-link-alt', size: '24' },
      { name: 'Close open tab on save', key: 'closeTabOnSave', icon: 'window', size: '22' },
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
