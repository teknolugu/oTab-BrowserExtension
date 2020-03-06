<template>
  <div class="h-full w-full content-wrapper">
    <component :is="$store.state.ui.activeHomePage"></component>
  </div>
</template>
<script>
import BoardList from './home/BoardList.vue';
import Preferences from './home/Preferences.vue';
import Profile from './home/Profile.vue';
import Backup from './home/Backup.vue';

export default {
  components: { BoardList, Preferences, Profile, Backup },
};
</script>
