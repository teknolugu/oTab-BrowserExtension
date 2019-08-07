<template>
  <div style="height: 100%">
    <div class="side-nav-notes-header">
      <el-input size="small" v-model="search" prefix-icon="el-icon-search"></el-input>
      <unicon name="file-plus-alt" class="add-note-btn" fill="#409eff" height="25px" width="25px" @click="newNote" />
    </div>
    <div class="no-open-tabs" v-if="notes.length === 0">
      <div class="no-open-tabs-icon">
        <span>
          <unicon height="35px" width="35px" name="notes"></unicon>
        </span>
      </div>
      <div class="no-open-tabs-content">
        <p>It's Empty</p>
      </div>
    </div>
    <el-scrollbar class="side-nav-scrollbar-notes" :native="false" v-else>
      <Draggable class="list-group" v-model="notes" style="min-height: 200px">
        <template v-for="(note, index) in searchHandle(notes, 'title', 'content')">
          <el-card
            :class="{ 'is-active': note.id === activeId, 'is-save': note.id === activeId && isUpdate }"
            class="notes-card"
            v-show="filterData(note)"
            @click.native="editNote(note)"
            :key="index + note.title"
            shadow="never"
          >
            <div slot="header" class="clearfix">
              <p class="notes-card-title">{{ note.title }}</p>
              <p class="notes-card-text">{{ prevContent(note.content) }}</p>
              <div class="note-tags" v-show="note.tags.length !== 0">
                <template v-for="(tag, idx) in note.tags">
                  <el-tag v-if="idx <= 2" effect="dark" class="capitalize collection-tag note" @click.stop="activeTag(tag.id)" size="small" :color="tag.color">
                    {{ tag.name }}</el-tag
                  >
                  <el-button v-if="idx === 3" size="mini" @click.stop>+{{ note.tags.length - 3 }}</el-button>
                </template>
              </div>
            </div>
            <div class="notes-card-body">
              <template v-if="note.id === activeNoteId">
                <el-button size="small" @click.stop="activeNoteId = ''">Cancel</el-button>
                <el-button size="small" type="danger" @click.stop="delNote(note.id)" class="right">Delete</el-button>
              </template>
              <template v-else>
                <el-button @click.stop="activeNoteId = note.id" icon="el-icon-delete" class="del-note-btn" size="small" circle></el-button>
                <unicon name="grip-horizontal-line" class="drag-handle note" fill="#a6a6a6" />
              </template>
            </div>
          </el-card>
        </template>
      </Draggable>
    </el-scrollbar>
  </div>
</template>
<script>
import Draggable from 'vuedraggable';
import SearchItem from '../../../mixins/search-item';
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
  components: { Draggable },
  mixins: [Tag('notes/list'), SearchItem],
  computed: {
    notes: {
      get() {
        return this.$store.getters['notes/list'];
      },
      set(val) {
        this.$store.commit('notes/setNotes', val);
      },
    },
  },
  data: () => ({
    activeNoteId: '',
  }),
  methods: {
    delNote(noteId) {
      this.$emit('delete', noteId);
    },
    prevContent(content) {
      return content ? content.slice(0, 50).replace(/(<([^>]+)>)/gi, '') : '';
    },
    newNote() {
      this.$store.dispatch('notes/createNewNote').then(({ isFirst, note }) => {
        if (isFirst) {
          this.$emit('change', note);
        } else if (!this.$props.isUpdate && !isFirst) {
          this.$emit('change', note);
          Bus.$emit('changeNote');
        }
      });
    },
    editNote(note) {
      if (this.$props.isUpdate) {
        this.$confirm('This note has been modified. Continue switch note?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        })
          .then(() => {
            this.$emit('change', note);
          })
          .catch(() => {});
      } else {
        this.$emit('change', note);
      }
      Bus.$emit('changeNote');
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
@import '../../../assets/themes/themes';

.collection-tag.note {
  margin-right: 4px;
}

.add-note-btn {
  cursor: pointer;

  &:hover {
    fill: #85bcf4;
  }
}

.drag-handle.note {
  margin-top: 5px;
  float: right;
}

.del-note-btn {
  opacity: 0;
  transition: all 0.5s ease;
}

.note-tags {
  display: inline-block;
  width: 100%;
  margin-top: 5px;
}

.notes-card:hover {
  .del-note-btn {
    opacity: 1;
  }
}

.notes-card {
  &:first-child {
    margin-top: 0px;
  }

  &.is-save {
    border-left: 3px solid #409eff;
  }

  &.is-active {
    @include themify($themes){
      box-shadow: 0 2px 12px 0 themed('shadow');
    }
  }

  margin-top: 15px;

  .el-card__header {
    padding: 12px 14px !important;
  }

  .el-card__body {
    padding: 6px 13px !important;
  }

  .notes-card-title {
    line-height: 1.2;
    font-size: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    -webkit-box-orient: vertical;
    margin-bottom: 3px;
    font-weight: 600;
    @include themify($themes){
      color: themed('text-primary');
    }
  }

  .notes-card-text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    @include themify($themes){
      color: themed('regular-primary');
    }
    margin: 0;
  }
}

.side-nav-scrollbar-notes {
  .el-scrollbar__wrap {
    padding: 0 19px 0 10px;
  }
}

.side-nav-notes-header {
  padding: 0 10px;
  height: 50px;

  * {
    display: inline-block;
  }

  svg {
    vertical-align: middle;
  }

  .el-input {
    margin-right: 7px;
    width: 85%;
  }
}
</style>
