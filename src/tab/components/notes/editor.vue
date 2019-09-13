<template>
  <v-card width="100%">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <template v-if="!$store.getters['notes/isEmpty']">
          <v-chip label draggable small class="note-editor-tag" @click:close="delTag(tag.id)" v-for="tag in note.tags" :key="tag.id" :color="tag.color" dark close>
            <span class="capitalize">{{ tag.name }}</span>
          </v-chip>
          <v-menu bottom right transition="scale-transition" origin="top left">
            <template v-slot:activator="{ on }">
              <v-btn icon depressed v-on="on" color="grey" class="ml-2" :disabled="getTags(note.tags).length === 0 || note.tags.length >= 5">
                <v-icon>{{ $icons.mdiPlus }}</v-icon>
              </v-btn>
            </template>
            <v-card width="200">
              <v-list dense>
                <v-list-item v-for="tag in getTags(note.tags)" :key="tag.id" @click="addTag(tag.id)">
                  <v-list-item-title class="capitalize body-2">{{ tag.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>
      </div>
      <div>
        <v-btn text color="error" class="mr-2" @click="deleteNote">Delete</v-btn>
        <v-btn color="primary" depressed :disabled="!isUpdate || $store.getters['notes/isEmpty']" @click="$emit('save')">
          <v-icon left>{{ $icons.mdiContentSave }}</v-icon>
          Save
        </v-btn>
      </div>
    </v-card-title>
    <v-divider class="mx-4" style="border-style: dashed;"></v-divider>
    <v-card-text class="pt-3">
      <editor-content @change="note => $emit('change', note)" :title="note.title" :content="note.content"></editor-content>
    </v-card-text>
  </v-card>
</template>
<script>
import getUnique from '../../utils/get-unique';
import EditorContent from './editor-content';

export default {
  components: { EditorContent },
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
    note: {
      type: Object,
      default: () => ({
        title: '',
        tags: [],
        id: '',
        content: '',
      }),
      required: true,
    },
  },
  methods: {
    async deleteNote() {
      const res = await this.$dialog.confirm({
        text: 'Are you sure want to delete this note?',
        title: 'Delete Note',
      });
      res ? this.$emit('delete', this.$props.note.id) : null;
    },
    delTag(tagId) {
      this.$store.commit('notes/delTag', { tagId, noteId: this.$props.note.id });
    },
    getTags(tags) {
      if (!this.$store.getters['notes/isEmpty']) {
        return getUnique(tags, this.$store.getters.board.allTags, 'name');
      }
    },
    addTag(tagId) {
      const tag = this.$store.getters.board.allTags.find(tag => tag.id === tagId);
      this.note.tags.push(tag);
    },
  },
};
</script>
<style lang="scss">
.note-editor-tag {
  margin-left: 6px;
  &:first-child {
    margin-left: 0;
  }
  i {
    font-size: 20px !important;
  }
}
</style>
