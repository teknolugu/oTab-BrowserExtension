<template>
  <v-expansion-panel class="collection-expansion">
    <v-expansion-panel-header>
      <div class="d-flex align-center">
        <span class="capitalize font-weight-medium subtitle-1">{{ item.title }}</span>
        <div class="collection-tag ml-4">
          <template v-for="tag in item.tags">
            <v-chip
              class="capitalize mx-1 collection-tag"
              small
              label
              dark
              @click:close="delCollectionTag(tag.id, collectionIndex)"
              @click.stop="activeTag(tag.id)"
              close
              :color="tag.color"
              >{{ tag.name }}</v-chip
            >
          </template>
        </div>
        <div class="flex-grow-1"></div>
        <v-btn small text color="primary" @click.stop="openAllTabs(item.tabs)"> open {{ item.tabs.length }} tabs </v-btn>
        <popover-menu @editTitle="editTitle" @addTag="addTag" @delete="deleteCollection" :index="collectionIndex" :items="item" name="collection">
          <template slot="content">
            <v-list-item @click="addHomeCollection">
              <v-list-item-icon>
                <v-icon>{{ $icons.mdiPlus }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <span class="body-2 font-weight-medium capitalize list-title">Add Collection to Home</span>
              </v-list-item-content>
            </v-list-item>
          </template>
        </popover-menu>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <Draggable class="row row--dense" ghost-class="ghost-card" v-model="item.tabs" group="tabs" handle=".drag-handle" :key="item.id">
        <v-col v-for="(tab, tabIndex) in searchResult" :key="tabIndex" cols="3">
          <tab-card :collectionIndex="collectionIndex" :index="tabIndex" :tab="tab"></tab-card>
        </v-col>
      </Draggable>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
import Draggable from 'vuedraggable';
import TabCard from './tab-card';
import PopoverMenu from '../popover-menu';
import FilterItem from '../../../mixins/filter-item';

export default {
  mixins: [FilterItem],
  props: {
    item: {
      type: Object,
      default: () => ({
        tabs: [],
        tags: [],
        title: '',
      }),
    },
    collectionIndex: {
      type: Number,
      default: 0,
    },
  },
  components: { TabCard, PopoverMenu, Draggable },
  data: () => ({
    openTabs: [],
    delCollectionPromt: false,
    getComponentData: {
      props: {
        dense: true,
      },
    },
  }),
  methods: {
    addHomeCollection() {
      const { activeBoard } = this.$store.state;
      const collectionId = `${activeBoard}=>${this.$props.collectionIndex}`;
      this.$browser.storage.sync.set({ homeCollection: collectionId });
      this.$store.commit('homeCollection', collectionId);
      this.$dialog.notify.success('Add collection to home');
    },
    getOpenTabs(tabs) {
      this.openTabs = tabs;
    },
    openAllTabs(allTabs) {
      allTabs.forEach(async tab => await this.$browser.tabs.create({ url: tab.url }));
    },
    deleteCollection(index) {
      this.$store.commit('collections/delCollection', index);
    },
    editTitle({ title, index }) {
      this.$store.commit('collections/editTitle', {
        collectionTitle: title,
        index,
      });
    },
    addTag({ index, tag }) {
      this.$store.commit('collections/addTag', { collectionIndex: index, tag });
    },
    activeTag(tagId) {
      this.$store.commit('activeTag', tagId);
    },
    delCollectionTag(tagId, collectionIndex) {
      this.$store.commit('collections/delTag', { collectionIndex, tagId });
    },
  },
  computed: {
    searchResult() {
      return this.searchFilter(this.$props.item.tabs, 'title', 'url');
    },
  },
};
</script>
