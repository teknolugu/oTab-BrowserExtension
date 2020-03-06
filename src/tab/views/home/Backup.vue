<template>
  <div class="flex" style="align-items: self-start">
    <card-ui width="280px">
      <div class="text-center">
        <unicon name="cloud-check" class="p-4 bg-gray-100 rounded-full" height="36" width="36"></unicon>
        <p class="text-base font-medium">Backup</p>
      </div>
      <hr class="mb-6 mt-5" />
      <div class="text-sm px-2">
        <p class="inline-block">Status</p>
        <p class="float-right font-medium" :class="[backup.active ? 'text-green' : 'text-red']">
          {{ backup.active ? 'Active' : 'Inactive' }}
        </p>
      </div>
      <div class="text-sm mb-8 mt-5 px-2">
        <p class="inline-block">Last backup</p>
        <p class="float-right font-medium">{{ backup.lastBackup | relativeTime }} ago</p>
      </div>
      <button-ui block @click="backupData" :disabled="!backup.active" :loading="loading">Backup now</button-ui>
    </card-ui>
    <card-ui class="ml-5 flex-grow">
      <list-ui>
        Backup data
        <switch-ui v-model="backupActive" slot="suffix"></switch-ui>
      </list-ui>
      <list-ui>
        Backup every
        <select-ui slot="suffix" small v-model="interval" :list="backupIntervals" placement="left" item-key="name" item-value="name"></select-ui>
      </list-ui>
    </card-ui>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { setStorage } from '@/utils/storage';

dayjs.extend(relativeTime);

export default {
  data: () => ({
    backupIntervals: ['day', 'week', 'month'],
    loading: false,
  }),
  computed: {
    backup() {
      return this.$store.state.backup;
    },
    interval: {
      set(value) {
        this.updateBackup('interval', value);
      },
      get() {
        return this.backup.interval;
      },
    },
    backupActive: {
      set(value) {
        this.updateBackup('active', value);
      },
      get() {
        return this.backup.active;
      },
    },
  },
  methods: {
    updateBackup(key, value) {
      this.$store.commit('backup/update', {
        key,
        value,
      });
    },
    backupData() {
      if (!this.backup.active) return;

      this.loading = true;

      this.$sendMessage('backupData')
        .then(() => {
          setTimeout(() => {
            setStorage('backup', {
              active: true,
              interval: this.interval,
              lastBackup: Date.now(),
            });
            this.$store.commit('backup/update', { key: 'lastBackup', value: Date.now() });
            this.loading = false;
          }, 2000);
        })
        .catch(() => {
          this.$toast.error('Something went wrong');
          clearTimeout(timeout);
        });
    },
  },
  filters: {
    relativeTime(timestamp) {
      return dayjs().from(timestamp, true);
    },
  },
};
</script>
