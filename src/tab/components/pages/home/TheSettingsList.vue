<template>
  <div class="h-full overflow-y-auto px-5 scrollbar">
    <p class="font-medium text-base inline-block text-default-soft">Boards</p>
    <template v-for="setting in boardSettings">
      <card-ui class="setting-card" style="background-color: transparent; padding: 0" :class="{ 'active-setting': setting.id === $route.name }">
        <router-link exact :to="getPath(setting.id)" class="p-3">
          <unicon :name="setting.icon" class="p-1" height="20" width="20"></unicon>
          <p class="text-base capitalize ml-3">{{ setting.name }}</p>
        </router-link>
      </card-ui>
    </template>
    <p class="font-medium text-base inline-block text-default-soft mt-8">Settings</p>
    <template v-for="setting in settings">
      <card-ui
        :disabled="loginRequire(setting.id)"
        class="setting-card"
        style="background-color: transparent; padding: 0"
        :class="{ 'active-setting': setting.id === $route.name }"
      >
        <router-link exact :to="getPath(setting.id)" class="p-3">
          <unicon :name="setting.icon" class="p-1" height="20" width="20"></unicon>
          <p class="text-base capitalize ml-3">{{ setting.name }}</p>
        </router-link>
      </card-ui>
    </template>
  </div>
</template>
<script>
export default {
  data: () => ({
    boardSettings: [
      { name: 'your boards', id: 'home-board-list', icon: 'apps' },
      // { name: 'shared boards', id: 'shared-board', icon: 'share-alt' },
    ],
    settings: [
      { name: 'Preferences', id: 'home-preferences', icon: 'swatchbook' },
      { name: 'Profile', id: 'home-profile', icon: 'user' },
      { name: 'Backup', id: 'home-backup', icon: 'cloud-upload' },
    ],
  }),
  methods: {
    getPath(id) {
      return `/home/${id.replace(/home-/g, '')}`;
    },
    loginRequire(id) {
      const { user } = this.$store.state;

      if (id === 'home-profile') return !user.isLogin;
      if (id === 'home-backup') return !user.isLogin && !user.emailVerified;

      return false;
    },
  },
};
</script>
<style lang="scss">
.setting-card {
  @apply border cursor-pointer relative mt-3;
  a {
    @apply flex items-center;
  }
  &:hover {
    @apply bg-gray-300 #{!important};
  }
  &.active-setting {
    @apply text-primary bg-gray-300 #{!important};
  }
}
</style>
