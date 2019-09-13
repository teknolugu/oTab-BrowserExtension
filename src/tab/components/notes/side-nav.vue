<template>
  <v-card color="transparent" flat width="100%" class="side-nav-notes pa-3 pb-4 scroller" :max-height="cardMaxHeight">
    <div class="d-flex justify-space-between mb-3 align-center">
      <p class="grey--text text-uppercase mb-0 body-2">my notes</p>
      <v-btn color="primary" small depressed @click="newNote">
        new note
      </v-btn>
    </div>
    <empty-item title="It's look like you don't have a note" v-if="notes.length === 0"></empty-item>
    <Draggable class="list-group" handle=".note-card-handle" v-else v-model="notes">
      <template v-for="note in searchFilter(notes, 'title', 'content')">
        <v-card
          v-show="tagFilter(note)"
          hover
          width="100%"
          :ripple="false"
          class="note-card mt-2"
          @click="editNote(note)"
          :class="{ 'elevation-5': note.id === activeId, 'is-save': note.id === activeId && isUpdate }"
        >
          <v-card-title class="pb-1">
            <p style="line-height: 1.4rem" class="subtitle-1 font-weight-medium mb-0">{{ note.title.slice(0, 50) }}</p>
          </v-card-title>
          <v-card-text class="pb-2">
            <p class="body-2">{{ prevContent(note.content) }}</p>
            <div class="note-card-tags">
              <template v-for="(tag, tagIndex) in note.tags">
                <v-chip label small dark class="note-card-tag" :color="tag.color" @click="activeTag(tag.id)" v-if="tagIndex <= 2">
                  <span class="capitalize">{{ tag.name }}</span>
                </v-chip>
                <v-chip small class="note-card-tag" label v-if="tagIndex === 3"> +{{ note.tags.length - 3 }} </v-chip>
              </template>
            </div>
          </v-card-text>
          <v-card-actions class="d-flex align-center justify-space-between bg-card py-1">
            <template v-if="note.id === delPromptId">
              <v-btn :ripple="false" small text color="grey" @click.stop="delPromptId = ''">Cancel</v-btn>
              <v-btn small color="error" class="my-1" depressed @click.stop="delNote(note.id)">Delete</v-btn>
            </template>
            <template v-else>
              <v-btn :ripple="false" class="delete-note-btn" icon color="error" @click.stop="delPromptId = note.id">
                <v-icon>{{ $icons.mdiDeleteOutline }}</v-icon>
              </v-btn>
              <v-icon class="note-card-handle">{{ $icons.mdiDrag }}</v-icon>
            </template>
          </v-card-actions>
        </v-card>
      </template>
    </Draggable>
  </v-card>
</template>
<script>
import Draggable from 'vuedraggable';

import EmptyItem from '../empty-item';

import FilterItem from '../../../mixins/filter-item';
import Tag from '../../../mixins/tag';

import getUnique from '../../utils/get-unique';
import Bus from '../../utils/bus';

export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
    activeId: String,
  },
  components: { Draggable, EmptyItem },
  mixins: [FilterItem],
  data: () => ({
    delPromptId: '',
  }),
  computed: {
    notes: {
      get() {
        return this.$store.getters['notes/list'];
      },
      set(val) {
        this.$store.commit('notes/setNotes', val);
      },
    },
    cardMaxHeight() {
      return window.innerHeight - 100;
    },
  },
  methods: {
    delNote(noteId) {
      this.$emit('delete', noteId);
    },
    prevContent(content, length = 60) {
      return content ? content.replace(/(<([^>]+)>)/gi, '').slice(0, length) : '';
    },
    newNote() {
      this.$store.dispatch('notes/createNewNote').then(({ isFirst, note }) => {
        if (isFirst) {
          this.$emit('change', note);
        } else if (!this.$props.isUpdate && !isFirst) {
          this.changeNote(note);
        }
      });
    },
    changeNote(note) {
      this.$emit('change', note);
      Bus.$emit('changeNote');
    },
    editNote(note) {
      const isActive = note.id === this.$props.activeId;
      if (this.$props.isUpdate && !isActive) {
        this.$dialog
          .confirm({
            text: 'This note has been modified. Continue switch note?',
            title: 'Warning',
          })
          .then(confirm => {
            confirm ? this.changeNote(note) : null;
          });
      } else {
        isActive ? null : this.changeNote(note);
      }
    },
    activeTag(tagId) {
      this.$store.commit('activeTag', tagId);
    },
    filteredTag(tags) {
      return getUnique(tags, this.$store.getters.board.allTags, 'title');
    },
  },
};
</script>
<style lang="scss">
.note-card {
  &-handle {
    cursor: grab;
  }
  &.is-save {
    border-left: 3px solid #409eff;
  }
  .delete-note-btn {
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s ease;
  }
  &:hover {
    .delete-note-btn {
      visibility: visible;
      opacity: 1;
    }
  }
}
.note-card-tag {
  margin-left: 3px;
  &:first-child {
    margin-left: 0;
  }
}
.side-nav-notes {
  overflow-y: auto;
  position: sticky;
  top: 50px;
}
</style>
