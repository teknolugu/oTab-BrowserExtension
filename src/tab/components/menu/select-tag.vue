<template>
  <div>
    <v-autocomplete
      dense
      :full-width="false"
      flat
      :background-color="selected.color"
      return-object
      :items="allTags"
      solo
      item-text="name"
      item-value="id"
      :value="selected"
      @change="changeSelected"
      :search-input.sync="inputValue"
      hide-details
      class="select-tag"
      :menu-props="{ 'min-width': 200 }"
      maxlength="10"
      :key="updateSelect"
    >
      <v-icon slot="prepend-inner" small>{{ $icons.mdiTag }}</v-icon>
      <template v-slot:no-data>
        <div class="add-tag">
          <p class="body-2 mb-2" @click="createTag">
            Click to add <b>{{ inputValue }}</b>
          </p>
          <v-btn block depressed dark :color="tagsColors.colors[tagsColors.index]" @click="changeColor">Change color</v-btn>
        </div>
      </template>
      <template v-slot:item="{ item }" class="test">
        <div class="select-tag-item">
          <div class="select-tag-item__color" :style="{ 'background-color': item.color }"></div>
          <span class="ml-3 subtitle-2 capitalize select-tag-item__text">{{ item.name }}</span>
          <div class="flex-grow-1"></div>
          <v-btn fab outlined small color="error" class="select-tag-item__button" @click.stop="delTag(item.id)" v-show="item.id !== 'all_tags#e4e4e4'">
            <v-icon dark>{{ $icons.mdiDeleteOutline }}</v-icon>
          </v-btn>
        </div>
      </template>
    </v-autocomplete>
  </div>
</template>
<script>
import Tag from '../../../mixins/tag';

export default {
  mixins: [Tag],
  data: () => ({
    selected: {
      color: '#e4e4e4',
      id: 'all_tags#e4e4e4',
      name: 'all tags',
    },
    inputValue: '',
    updateSelect: 0,
  }),
  watch: {
    activeBoard() {
      this.updateSelect++;
    },
    activeTag: {
      handler(tagId) {
        const tag = tagId.split('#');
        this.selected = {
          color: `#${tag[1]}`,
          id: tagId,
          name: tag[0],
        };
      },
      deep: true,
    },
  },
  computed: {
    activeBoard() {
      return this.$store.state.activeBoard;
    },
    activeTag() {
      return this.$store.state.activeTag;
    },
    allTags() {
      if (typeof this.$store.getters.board !== 'undefined') {
        const allTags = [{ name: 'all tags', color: '#e4e4e4', id: 'all_tags#e4e4e4' }, ...this.$store.getters.board.allTags];
        return allTags;
      }
    },
  },
  methods: {
    defaultData() {
      this.selected = {
        color: '#e4e4e4',
        id: 'all_tags#e4e4e4',
        name: 'all tags',
      };
    },
    delTag(tagId) {
      this.selected.id === tagId ? this.defaultData() : null;
      this.$store.dispatch('deleteTag', tagId);
    },
    changeSelected(tag) {
      this.$store.commit('activeTag', tag.id);
    },
  },
};
</script>
<style lang="scss">
.add-tag {
  padding: 0 16px;
  p {
    cursor: pointer;
    padding: 10px 7px;
    border-radius: 4px;
    text-align: center;
    &:hover {
      background-color: #00000008;
    }
  }
}
.select-tag {
  border: 2px solid #0000000d;
  &.v-input--is-focused {
    .v-input__control {
      width: 190px;
    }
  }
  .v-input__control {
    transition: all 0.2s ease;
    min-height: 33px !important;
    font-size: 14px;
    text-transform: capitalize;
    width: 140px;
  }
}
.select-tag-item {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  background: transparent;
  display: flex;
  align-items: center;
  padding: 0 12px;
  &__button {
    visibility: hidden;
    opacity: 0;
    height: 30px !important;
    width: 30px !important;
    .v-icon {
      font-size: 20px !important;
    }
  }
  &__color,
  &__text,
  &__button {
    transition: all 0.2s ease;
  }
  &__color {
    height: 90%;
    width: 18px;
    position: absolute;
    left: -13px;
    border-radius: 2px;
  }
  &__text {
    z-index: 1;
  }
  &:hover {
    .select-tag-item__button {
      opacity: 1;
      visibility: visible;
    }
    .select-tag-item__text {
      transform: translateX(3px);
    }
    .select-tag-item__color {
      width: 12%;
    }
  }
}
</style>
