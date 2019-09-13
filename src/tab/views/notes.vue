<template>
  <v-row class="fill-height">
    <v-col class="custom-layout pa-0" cols="3">
      <side-nav @change="changeContent" :isUpdate="isUpdate" @delete="delNote" :activeId="note.id"></side-nav>
    </v-col>
    <v-col class="custom-layout" cols="9">
      <editor :note="note" @change="updateContent" @delete="delNote" @save="saveNote" :isUpdate="isUpdate"></editor>
    </v-col>
  </v-row>
</template>
<script>
import SideNav from '../components/notes/side-nav';
import Editor from '../components/notes/editor';
import Bus from '../utils/bus';

export default {
  components: { Editor, SideNav },
  data: () => ({
    isUpdate: false,
    content: '',
    note: {
      title: '',
      tags: [],
      id: '',
      content: '',
    },
  }),
  methods: {
    delNote(noteId) {
      this.$store.commit('notes/delNote', noteId);
      if (this.note.id === noteId) {
        this.toFirstNote();
        this.isUpdate = false;
      } else if (this.$store.getters['notes/isEmpty']) {
        this.content = '';
        this.note = {
          title: '',
          tags: [],
          id: '',
          content: '',
        };
      }
    },
    saveNote() {
      const note = { ...this.note, content: this.content };
      this.$store.dispatch('notes/saveNote', note);
      this.isUpdate = false;
    },
    updateContent(content) {
      this.isUpdate = true;
      this.note.title = content.title;
      this.content = content.content;
    },
    changeContent(note) {
      this.content = '';
      this.note = { ...note };
      this.isUpdate = false;
    },
    toFirstNote() {
      this.note = { ...this.$store.getters['notes/list'][0] };
    },
  },
  created() {
    Bus.$on('changeBoard', this.toFirstNote);
    this.toFirstNote();
  },
};
</script>
<style lang="scss">
.custom-layout {
  &.col-3 {
    flex: 0 0 23% !important;
    max-width: 23% !important;
  }
  &.col-9 {
    flex: 0 0 77% !important;
    max-width: 77% !important;
  }
}
</style>
