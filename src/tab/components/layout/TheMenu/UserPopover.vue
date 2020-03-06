<template>
  <v-popover placement="left" offset="5">
    <button-icon icon="user" class="bg-gray-200 cursor-pointer"></button-icon>
    <template slot="popover">
      <card-ui class="shadow-xl" width="240px">
        <div class="mb-4 pb-4 border-b">
          <template v-if="user.isLogin">
            <p class="text-base font-medium">{{ user.name }}</p>
            <p class="text-default-soft leading-none text-sm">{{ user.email }}</p>
          </template>
          <p class="text-base font-medium" v-else>Guest</p>
        </div>
        <div class="mb-5">
          <span class="text-base">Dark theme</span>
          <switch-ui v-model="darkTheme" class="float-right"></switch-ui>
        </div>
        <list-ui icon="cog" @click="gotoSetting">Settings</list-ui>
        <list-ui icon="exit" class="text-red" v-if="user.isLogin" @click="signOut">Sign out</list-ui>
        <list-ui icon="entry" v-else @click="$modal.show('auth')">Login</list-ui>
      </card-ui>
    </template>
  </v-popover>
</template>
<script>
export default {
  computed: {
    darkTheme: {
      set(value) {
        this.$store.commit('settings/updateSetting', {
          key: 'dark',
          value,
        });
      },
      get() {
        return this.$store.state.settings.dark;
      },
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    signOut() {
      this.$sendMessage('signOut', {
        email: this.$store.state.user.email,
      }).then(() => {
        this.$store.commit('ui/update', { key: 'activeHomePage', value: 'board-list' });
        this.$store.commit('user/toDefault');
        this.$store.dispatch('overrideLocalData', {
          boards: {},
          items: {},
          labels: {},
          columns: {},
        });
      });
    },
    gotoSetting() {
      this.$store.commit('ui/update', {
        key: 'activeHomePage',
        value: 'preferences',
      });
      this.$router.push('/');
    },
  },
};
</script>
