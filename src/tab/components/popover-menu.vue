<template>
  <v-menu offset-y min-width="250px" max-width="300px" :close-on-content-click="false" v-model="menu">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" @click.stop icon>
        <v-icon>{{ $icons.mdiDotsVertical }}</v-icon>
      </v-btn>
    </template>
    <v-list dense nav class="popover-menu-list">
      <slot name="content"></slot>
      <v-list-group :prepend-icon="$icons.mdiPencil" @click="title = items.title" v-model="activeEditTitle">
        <template v-slot:activator>
          <v-list-item-content>
            <span class="body-2 font-weight-medium capitalize list-title">Edit {{ name }} title</span>
          </v-list-item-content>
        </template>
        <div class="edit-item-title mx-2">
          <v-text-field class="mt-1" autofocus :label="name + ' name'" hide-details v-model="title"></v-text-field>
          <v-btn class="mt-2" small depressed color="primary" block @click="editTitle">Save</v-btn>
        </div>
      </v-list-group>
      <v-slide-y-transition mode="out-in">
        <v-list-item @click="delItemPrompt = true" v-if="!delItemPrompt">
          <v-list-item-icon>
            <v-icon>{{ $icons.mdiDeleteOutline }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <span class="body-2 font-weight-medium capitalize list-title">delete {{ name }}</span>
          </v-list-item-content>
        </v-list-item>
        <div class="d-flex justify-space-between my-2" v-else>
          <v-btn small outlined @click="delItemPrompt = false">Cancel</v-btn>
          <v-btn small color="error" depressed @click="delItem">Delete</v-btn>
        </div>
      </v-slide-y-transition>
      <v-list-item>
        <v-autocomplete
          :disabled="items.tags.length >= 5"
          :search-input.sync="inputValue"
          background-color="background"
          hide-details
          @change="addTag"
          solo
          flat
          :items="tagData(items.tags)"
          return-object
          item-text="name"
          maxlength="10"
          item-value="id"
          :placeholder="'Add ' + name + ' tag'"
          v-model="selected"
          class="select-tag-popover"
        >
          <template v-slot:no-data>
            <div class="add-tag" v-if="showCreateTag">
              <p class="body-2 mb-2" @click="createTag">
                Click to add <b>{{ inputValue }}</b>
              </p>
              <v-btn block depressed dark :color="tagsColors.colors[tagsColors.index]" @click="changeColor">Change color</v-btn>
            </div>
            <span v-else>
              Type to add tag
            </span>
          </template>
        </v-autocomplete>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import getUnique from '../utils/get-unique';
import Tag from '../../mixins/tag';

export default {
  mixins: [Tag],
  props: {
    index: {
      type: Number,
      default: 0,
    },
    items: Object,
    name: {
      type: String,
      default: 'item',
    },
  },
  data: () => ({
    activeEditTitle: false,
    menu: false,
    selected: {},
    inputValue: '',
    showCreateTag: false,
    title: '',
    delItemPrompt: false,
  }),
  watch: {
    menu(value) {
      if (!value) {
        this.inputValue = this.title = '';
        this.showCreateTag = this.delItemPrompt = this.activeEditTitle = false;
        this.selected = {};
      }
    },
    inputValue(val) {
      if (val !== null) this.showCreateTag = val.length >= 1;
    },
  },
  methods: {
    editTitle() {
      if (this.title !== '') this.$emit('editTitle', { title: this.title, index: this.$props.index });
    },
    addTag(tag) {
      if (typeof tag !== 'undefined') this.$emit('addTag', { index: this.$props.index, tag });
      this.selected = {};
    },
    tagData(tags) {
      return getUnique(tags, this.$store.getters.board.allTags, 'name');
    },
    delItem() {
      this.delItemPrompt = false;
      this.$emit('delete', this.$props.index);
      this.menu = false;
    },
  },
};
</script>
<style lang="scss">
.select-tag-popover {
  width: 200px;
  .v-input__control {
    font-size: 14px !important;
    min-height: 35px !important;
  }
}
.popover-menu-list {
  .list-title {
    margin-left: 14px;
  }
  .v-list-group__header__append-icon {
    margin-left: 0 !important;
  }
  .v-list-item__icon {
    margin-right: 0 !important;
    .v-icon {
      font-size: 22px !important;
    }
  }
}

.edit-item-title {
  .v-input__control {
    font-size: 14px;
    min-height: 20px !important;
  }
}
</style>
