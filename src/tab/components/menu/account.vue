<template>
  <v-menu offset-y max-width="300px">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" class="px-2 ml-2">
        <span class="body-2 d-inline-block text-truncate" style="text-transform: none; max-width: 150px">{{ $store.state.user.name }}</span>
        <v-icon right>{{ $icons.mdiChevronDown }}</v-icon>
      </v-btn>
    </template>
    <v-list nav dense min-width="250px">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ $store.state.user.email }}</v-list-item-title>
          <v-list-item-subtitle>{{ $store.state.user.name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click.stop v-show="isLogin">
        <v-list-item-icon>
          <v-icon>{{ $icons.mdiPencil }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content @click="openSettings(1)">
          <v-list-item-title>Edit Profile</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Dark Theme</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action @click.stop>
          <v-switch v-model="darkTheme" color="primary"></v-switch>
        </v-list-item-action>
      </v-list-item>
      <v-list-item @click="openSettings(0)">
        <v-list-item-icon>
          <v-icon>{{ $icons.mdiSettings }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="openAuth">
        <v-list-item-icon>
          <v-icon>{{ isLogin ? $icons.mdiLogout : $icons.mdiLogin }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ isLogin ? 'Logout' : 'Login' }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import Bus from '../../utils/bus';

export default {
  methods: {
    openSettings(tabId) {
      Bus.$emit('settings', tabId);
    },
    openAuth() {
      if (!this.$store.state.isLogin) {
        Bus.$emit('auth');
      } else {
        this.sendMessage('signOut').then(() => {
          this.$store.commit('changeBoolean', { key: 'isLogin', data: false });
          this.$store.commit('changeUser', { name: 'Guest', email: '' });
        });
      }
    },
  },
  computed: {
    darkTheme: {
      set(value) {
        this.$vuetify.theme.dark = value;
        this.$store.commit('settings/change', { key: 'dark', value });
        this.$browser.storage.sync.set({ oTabSettings: this.$store.state.settings.items });
      },
      get() {
        return this.$vuetify.theme.dark;
      },
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
  },
};
</script>
