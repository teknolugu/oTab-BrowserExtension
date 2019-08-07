<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="5" class="side-nav-notes br">
        <side-nav @delete="delNote" :isUpdate="isUpdate" :activeId="note.id" @change="changeContent"></side-nav>
      </el-col>
      <el-col :span="19" :offset="5" class="note-wrapper">
        <div class="note-header">
          <div class="note-props">
            <div style="display: inline-block;">
              <el-tag
                v-for="(tag, index) in note.tags"
                :color="tag.color"
                :key="tag.id"
                size="medium"
                closeable
                class="collection-tag capitalize"
                closable
                effect="dark"
                :disable-transitions="true"
                @close="delNoteTag(index)"
                >{{ tag.name }}</el-tag
              >
              <el-select v-if="selectVisible" placeholder="Select" size="mini" value="Select tag" @change="addTag">
                <template slot="prefix">
                  <unicon name="multiply" @click="selectVisible = false" fill="#c2cadb" height="27px" width="17px"></unicon>
                </template>
                <el-option v-for="item in options" :key="item.id" :label="item.name" class="input-new-tag" :value="item.id"> </el-option>
              </el-select>
              <el-button v-show="note.tags && note.tags.length !== 5" v-else icon="el-icon-plus" class="button-new-tag" size="mini" @click="selectVisible = true"></el-button>
            </div>
            <div style="display: inline-block;" class="right">
              <el-popover placement="top" width="160" v-model="delPop">
                <p>Are you sure to delete this note?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="delPop = false">cancel</el-button>
                  <el-button type="primary" size="mini" @click="delNote(note.id)">confirm</el-button>
                </div>
                <el-button :disabled="$store.getters['notes/isEmpty']" slot="reference" size="medium" icon="el-icon-delete">Delete</el-button>
              </el-popover>
              <el-button type="primary" class="save-note-btn" :disabled="!isUpdate" @click="saveNote" size="medium" icon="el-icon-check">Save</el-button>
            </div>
          </div>
        </div>
        <div class="note-content">
          <Editor @change="updateContent" :title="note.title" :content="note.content"></Editor>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>
import getUnique from '../utils/get-unique';
import SideNav from '../components/notes/side-nav';
import Editor from '../components/notes/editor';
import Bus from '../utils/bus';
export default {
  components: { SideNav, Editor },
  data: () => ({
    delPop: false,
    isUpdate: false,
    selectVisible: false,
    content: null,
    note: {
      title: '',
      tags: [],
      id: '',
      content: null,
    },
  }),
  computed: {
    options() {
      return getUnique(this.note.tags, this.$store.getters.board.allTags, 'name');
    },
  },
  methods: {
    delNote(noteId) {
      this.delPop = false;
      this.$store.commit('notes/delNote', noteId);
      this.note.id === noteId ? this.toFirstNote() : null;
    },
    saveNote() {
      let note = { ...this.note, content: this.content };
      this.$store.dispatch('notes/saveNote', note);
      this.isUpdate = false;
    },
    delNoteTag(index) {
      this.note.tags.splice(index, 1);
    },
    addTag(tagId) {
      this.selectVisible = false;
      let tag = this.$store.getters.board.allTags.find(tag => tag.id === tagId);
      this.note.tags.push(tag);
    },
    updateContent(content) {
      this.isUpdate = true;
      this.note.title = content.title;
      this.content = content.content;
    },
    changeContent(note) {
      this.content = null;
      this.note = { ...note };
      this.selectVisible = false;
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
.note-props {
  .el-input {
    width: 120px !important;
  }
}
.save-note-btn {
  margin-left: 15px !important;
}

.note-wrapper {
  padding: 0 30px !important;
}

.note-content {
  min-height: 200px;
  padding: 10px 28px;
  border-radius: 2px;
  width: 88%;
  margin: 0 auto;
}

.note-title {
  margin: 10px 0 15px 0;
  box-sizing: border-box;
  font-size: 24px !important;

  textarea {
    padding: 0 !important;
    border: none;
    font-weight: 600;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑, Arial, sans-serif;
  }
}

.note-header {
  padding: 10px 15px;
}

.side-nav-notes {
  padding: 0 !important;
  height: 85%;
  position: fixed;
}

.side-nav-scrollbar-notes {
  height: 90%;

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
