<template>
  <nav class="h-full side-menu bg-gray-200 py-8" :class="{ hide: value }">
    <unicon
      name="angle-left"
      class="rounded-full shadow-xl bg-card p-2 cursor-pointer absolute duration-200 right-0 top-0 mt-6"
      :class="[value ? '-mr-12 rotate-icon-180' : '-mr-5']"
      @click.native="$emit('input', !value)"
      style="z-index: 2"
    ></unicon>
    <div class="content h-full">
      <transition enter-active-class="slideInLeft" leave-active-class="slideOutLeft" mode="out-in">
        <component :is="sideMenuComponent"></component>
      </transition>
    </div>
  </nav>
</template>
<script>
import OpenTabs from '../pages/board/TheOpenTabs.vue';
import SettingsList from '../pages/home/TheSettingsList.vue';
import NoteList from '../pages/note/TheNoteList.vue';

export default {
  props: {
    value: Boolean,
  },
  components: { OpenTabs, SettingsList, NoteList },
  computed: {
    sideMenuComponent() {
      const { name } = this.$route;

      if (name === 'board') return 'open-tabs';
      if (name.includes('home-')) return 'settings-list';
      if (name === 'note') return 'note-list';
    },
  },
};
</script>
<style lang="scss">
.side-menu {
  transition: all 0.7s ease;
  width: 18.75rem;
  z-index: 0;
  position: relative;
  .content {
    opacity: 1;
    visibility: visible;
  }
}
.side-menu.hide {
  position: unset;
  width: 20px;
  transform: translateX(-20px);
  .content {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
