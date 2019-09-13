<template>
  <v-container class="py-0">
    <v-alert type="warning" class="mt-3 mb-0" dense v-show="!$store.state.user.emailVerified">
      You need to verify your email
      <p class="caption ma-0">If you already verified your email try to logout and login again</p>
      <v-btn text slot="append" small @click="resendVerifyEmail">
        Resend verify email
      </v-btn>
    </v-alert>
    <v-subheader class="pl-0">Backup</v-subheader>
    <v-card>
      <v-list dense class="py-0">
        <v-list-item>
          <v-list-item-icon class="mr-4">
            <v-icon large class="background pa-2" style="border-radius: 30px">{{ $icons.mdiCloudUpload }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Backup Data</v-list-item-title>
            <v-list-item-subtitle
              >Last Backup: <b>{{ lastBackupTime }}</b></v-list-item-subtitle
            >
          </v-list-item-content>
          <v-list-item-action>
            <v-btn color="primary" :loading="loading" small depressed @click="backupData" :disabled="!$store.state.user.emailVerified || disableBackup">
              Backup Now
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="py-2">
          <v-list-item-content>
            <span class="subtitle-2 font-weight-regular">Backup Data Every</span>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            <v-select
              hide-details
              outlined
              class="select-search-engine"
              item-text="name"
              item-value="value"
              :items="backupIntervals"
              @change="changeInterval"
              :value="interval"
            ></v-select>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="py-2">
          <v-list-item-content>
            <span class="subtitle-2 font-weight-regular">Backup status</span>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            <v-btn-toggle color="primary" :disabled="!$store.state.user.emailVerified" mandatory v-model="backupStatus">
              <v-btn small active-class="primary" :value="false">Enable</v-btn>
              <v-btn small active-class="primary" :value="true">Disable</v-btn>
            </v-btn-toggle>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    backupIntervals: [{ name: 'week', value: 6.048e8 }, { name: 'day', value: 8.64e7 }],
    disableBackup: false,
    interval: 6.048e8,
    lastBackup: null,
    loading: false,
  }),
  methods: {
    resendVerifyEmail() {
      this.sendMessage('resendVerifyEmail').then(() => this.$dialog.notify.success('Check your email inbox'));
    },
    changeInterval(interval) {
      this.interval = interval;
      this.$browser.storage.sync.set({ backupInterval: interval, backupTime: Date.now() + interval });
    },
    backupData() {
      this.loading = true;
      this.sendMessage('backupData')
        .then(() => {
          this.lastBackup = Date.now();
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    },
  },
  computed: {
    backupStatus: {
      set(value) {
        this.disableBackup = value;
        this.$browser.storage.sync.set({ disableBackup: value });
      },
      get() {
        return this.disableBackup;
      },
    },
    lastBackupTime() {
      if (this.$store.state.user.emailVerified) {
        const date = new Date(this.lastBackup).toString();
        return `${date.slice(0, 3)},${date.slice(3, 15)}.${date.slice(16, 24)}`;
      }
      return 'Verify your email';
    },
  },
  async mounted() {
    const { lastBackup, backupInterval, disableBackup } = await this.$browser.storage.sync.get(['lastBackup', 'backupInterval', 'disableBackup']);
    if (typeof lastBackup === 'undefined') {
      this.lastBackup = '';
      this.$browser.storage.sync.set({ lastBackup: Date.now() });
    } else {
      this.lastBackup = lastBackup;
    }
    this.backupStatus = disableBackup;
    this.interval = backupInterval;
  },
};
</script>
