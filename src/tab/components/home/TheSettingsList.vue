<template>
  <div class="h-full overflow-y-auto px-5 scrollbar">
    <p class="font-medium text-base inline-block text-default-soft">Boards</p>
    <template v-for="setting in boardSettings">
      <card-ui
        class="flex items-center mt-3 first:mt-0 cursor-pointer relative"
        hover
        :class="{ 'active-setting': setting.id === activeSetting }"
        @click="updateHomePage(setting.id)"
      >
        <unicon :name="setting.icon" class="p-1" height="20" width="20"></unicon>
        <p class="text-base capitalize ml-3">{{ setting.name }}</p>
        <div class="absolute h-5 w-1 bg-primary right-0 mr-3 rounded-full" v-if="setting.id === activeSetting"></div>
      </card-ui>
    </template>
    <p class="font-medium text-base inline-block text-default-soft mt-4">Settings</p>
    <template v-for="setting in settings">
      <card-ui
        :disabled="loginRequire(setting.id)"
        class="flex items-center mt-3 first:mt-0 cursor-pointer relative"
        hover
        :class="{ 'active-setting': setting.id === activeSetting }"
        @click="updateHomePage(setting.id)"
      >
        <unicon :name="setting.icon" class="p-1" height="20" width="20"></unicon>
        <p class="text-base capitalize ml-3">{{ setting.name }}</p>
        <div class="absolute h-5 w-1 bg-primary right-0 mr-3 rounded-full" v-if="setting.id === activeSetting"></div>
      </card-ui>
    </template>
  </div>
</template>
<script>
export default {
  data: () => ({
    boardSettings: [
      { name: 'your boards', id: 'board-list', icon: 'apps' },
      // { name: 'shared boards', id: 'shared-board', icon: 'share-alt' },
    ],
    settings: [
      { name: 'Preferences', id: 'preferences', icon: 'swatchbook' },
      { name: 'Profile', id: 'profile', icon: 'user' },
      { name: 'Backup', id: 'backup', icon: 'cloud-upload' },
    ],
  }),
  methods: {
    updateHomePage(id) {
      this.$store.commit('ui/update', {
        key: 'activeHomePage',
        value: id,
      });
    },
    loginRequire(id) {
      if (id === 'profile' || id === 'backup') return !this.$store.state.user.isLogin;

      return false;
    },
  },
  computed: {
    activeSetting() {
      return this.$store.state.ui.activeHomePage;
    },
  },
};
</script>
<style>
.active-setting {
  @apply shadow-lg text-primary !important;
}
</style>
