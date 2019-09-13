<template>
  <div>
    <v-card
      outlined
      v-for="(collection, index) in collectionList"
      :key="index"
      :class="{ 'active-collection': getId(collection.title, index) === activeCollection }"
      class="collection-card"
      @click="changeActive(collection.title, index)"
      v-show="filterSearch(collection.title)"
    >
      <v-list-item @click="changeActive(collection.title, index)">
        <v-list-item-content>
          <v-list-item-title :title.native="collection.title">
            <span class="d-inline-block text-truncate subtitle-2" style="max-width: 80%; vertical-align: middle;">{{ collection.title }}</span>
            <span class="caption grey--text">({{ collection.tabs.length }})</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="ma-0">
          <v-btn small depressed color="primary" @click.stop="openAllTabs(collection.tabs)" class="px-1" :disabled="collection.tabs.length === 0">Open All</v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
import Bus from '../bus';

export default {
  props: {
    search: {
      type: String,
      default: '',
    },
  },
  watch: {
    activeCollection(value) {
      Bus.$emit('changeIndex', value[value.length - 1]);
    },
  },
  data: () => ({
    activeCollection: '',
  }),
  computed: {
    collectionList() {
      return this.$store.getters['collections/list'];
    },
  },
  methods: {
    filterSearch(name) {
      return name.toLowerCase().match(this.$props.search.toLowerCase());
    },
    changeActive(name, index) {
      this.activeCollection = this.getId(name, index);
    },
    getId(name, index) {
      const id = name.toLowerCase().replace(/ /g, '_') + index;
      return id;
    },
    openAllTabs(tabs) {
      tabs.forEach(async tab => await this.$browser.tabs.create({ url: tab.url }));
    },
  },
  mounted() {
    setTimeout(() => {
      this.changeActive(this.collectionList[0].title, 0);
    }, 1000);
  },
  created() {
    Bus.$on('changeBoard', () => this.changeActive(this.collectionList[0].title, 0));
  },
};
</script>
<style lang="scss">
.collection-card {
  transition: all 0.3s ease;

  &.active-collection {
    border: 1px solid #409eff !important;
    background-color: #00000008;
  }
  margin-top: 9px;
  &:first-child {
    margin-top: 0px;
  }
}
</style>
