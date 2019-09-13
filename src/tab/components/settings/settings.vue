<template>
  <v-dialog v-model="visible" width="650">
    <v-card class="pb-5 settings" color="background3">
      <v-tabs v-model="tab" mandatory background-color="background2" class="elevation-2 mb-2" style="border-radius: unset;">
        <v-tab>
          <v-icon left>{{ $icons.mdiSettings }}</v-icon>
          <span>General</span>
        </v-tab>
        <v-tab :disabled="!isLogin">
          <v-icon left>{{ $icons.mdiAccount }}</v-icon>
          <span>Profile</span>
        </v-tab>
        <v-tab :disabled="!isLogin">
          <v-icon left>{{ $icons.mdiCloudUpload }}</v-icon>
          <span>Backup</span>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" class="mb-2">
        <v-tab-item>
          <v-card min-height="300px" flat color="transparent" class="px-2">
            <general-settings :settings="settings" @change="commitSetting"></general-settings>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card min-height="300px" flat color="transparent" class="px-2">
            <profile-settings @change="changeTab"></profile-settings>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card min-height="300px" flat color="transparent" class="px-2">
            <backup-settings></backup-settings>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>
<script>
import Bus from '../../utils/bus';
import GeneralSettings from './general-settings';
import ProfileSettings from './profile-settings';
import BackupSettings from './backup-settings';

export default {
  components: { GeneralSettings, ProfileSettings, BackupSettings },
  data: () => ({
    tab: 0,
    visible: false,
  }),
  methods: {
    commitSetting(payload) {
      this.$store.commit('settings/change', payload);
      this.$browser.storage.sync.set({ oTabSettings: this.settings });
    },
    changeTab(tabId) {
      this.tab = tabId;
    },
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    settings() {
      return this.$store.state.settings.items;
    },
  },
  created() {
    Bus.$on('settings', (tabId = 0) => {
      this.visible = true;
      this.tab = tabId;
    });
  },
};
</script>
<style lang="scss">
.settings {
  .v-window {
    background: transparent !important;
  }
}
</style>
