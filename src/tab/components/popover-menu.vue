<template>
  <el-popover :placement="direction" width="250" trigger="click" v-model="popover">
    <div class="el-list">
      <div class="el-list-item" @click="editTitleEl">
        <div class="el-list-icon">
          <unicon name="pen" height="20px" width="20px" title="edit" class="item-edit-icon" fill="#a6a6a6" />
        </div>
        <div class="el-list-text">
          <p>Edit {{name}} Title</p>
        </div>
      </div>
      <transition name="slide-fade-up" mode="out-in">
        <div class="el-list-item bb edit-title" v-show="editTitleActive">
          <div class="el-list-icon">
            <el-input :maxlength="25" show-word-limit placeholder="Please input" autofocus v-model="title" size="small"></el-input>
          </div>
          <div class="el-list-text">
            <el-button size="mini" @click="editTitleActive = false">Cancel</el-button>
            <el-button size="mini" type="primary" class="right" @click="editTitle">Done</el-button>
          </div>
        </div>
      </transition>
      <transition name="slide-fade-up2" mode="out-in">
        <div class="el-list-item" v-if="delItemPrompt" key="delItemPrompt">
          <div class="el-list-icon">
            <el-button @click="delItemPrompt = false" size="small">Cancel</el-button>
          </div>
          <div class="el-list-text prompt">
            <el-button @click="delCollection(index)" size="small" type="danger">Delete</el-button>
          </div>
        </div>
        <div class="el-list-item" @click="delItemPrompt = true" v-else>
          <div class="el-list-icon">
            <i class="el-icon-close"></i>
          </div>
          <div class="el-list-text">
            <p>Delete {{name}}</p>
          </div>
        </div>
      </transition>
      <div class="el-list-item select">
        <div class="element-select">
          <el-select
            multiple
            :multiple-limit="5 - items.tags.length"
            size="small"
            collapse-tags
            placeholder="Add item tag"
            v-model="select"
            filterable
            :disabled="items.tags.length === 5"
          >
            <el-option v-for="(item, index) in tagData(items.tags)" :key="index" :label="item.name" :value="item.id" class="option-tag">
              <p :style="{ 'background-color': item.color }">{{ item.name }}</p>
            </el-option>
          </el-select>
          <el-button @click.stop="addTag" size="mini" icon="el-icon-plus" type="primary"></el-button>
        </div>
      </div>
    </div>
    <div slot="reference" @click.stop style="display: inline-block;">
      <slot></slot>
    </div>
  </el-popover>
</template>
<script>
import getUnique from '../utils/get-unique';
export default {
  props: ['items', 'index', 'direction', 'name'],
  data: () => ({
    select: [],
    editTitleActive: false,
    title: '',
    popover: false,
    delItemPrompt: false,
  }),
  methods: {
    editTitle() {
      if (this.title !== '') this.$emit('editTitle', { title: this.title, index: this.$props.index });
      this.editTitleActive = false;
    },
    editTitleEl() {
      this.editTitleActive = !this.editTitleActive;
      if (this.editTitleActive) this.title = this.$props.items.title;
    },
    addTag() {
      this.$emit('addTag', { select: this.select, index: this.$props.index });
      this.select = [];
    },
    tagData(tags) {
      return getUnique(tags, this.$store.getters.board.allTags, 'name');
    },
    delCollection(index) {
      this.delItemPrompt = false;
      this.$emit('delete', index);
      this.popover = false;
    },
  },
};
</script>
<style lang="scss">
@import '../../assets/slide-transitions.scss';

@include slideTransition(up, -5px, 0.3s);
@include slideTransition(up2, -4px, 0.2s) .element-select {
  display: inline-block;
  button {
    padding: 8px 16px !important;
  }
  .el-select {
    width: 75%;
    margin-right: 6px;
  }
  input {
    text-transform: capitalize;
  }
}
.el-popover {
  padding: 8px !important;
}

.edit-title {
  padding-bottom: 10px !important;
  div {
    width: 100%;
  }
  .el-list-text {
    padding-top: 10px;
  }
}

.el-list-item.select {
  button {
    text-transform: capitalize;
  }
}
.el-list-text.prompt {
  float: right;
}
.el-list-item.edit-title:hover {
  background-color: white;
}
.el-list-item {
  .el-list-icon,
  .el-list-text {
    display: inline-block;
  }
  cursor: pointer;
  border-radius: 4px;
  padding: 5px 10px;

  &:hover {
    background-color: #f9f9f9;
  }
}

.el-list-icon {
  min-width: 25px;
  i {
    font-size: 18px;
    vertical-align: text-bottom;
  }
  svg {
    vertical-align: sub;
  }
}

.item-popover {
  float: right;
  margin-right: 10px;

  button {
    font-size: 17px;
    transform: rotate(90deg);
    border-radius: 30px;
  }
}
</style>
