<template>
  <v-row class="fill-height">
    <v-col cols="9">
      <empty-item :icon="$icons.mdiBookmarkOutline" title="There's nothing here" v-if="isEmpty"></empty-item>
      <v-expansion-panels :focusable="false" multiple :value="collectionsExpands" v-else>
        <template v-for="(collection, collectionIndex) in dataFiltered">
          <collection :item="collection" :collectionIndex="collectionIndex"></collection>
        </template>
      </v-expansion-panels>
    </v-col>
    <v-col cols="3">
      <side-nav></side-nav>
    </v-col>
  </v-row>
</template>
<script>
import SideNav from '../components/collections/side-nav';
import Collection from '../components/collections/collection';
import EmptyItem from '../components/empty-item';

export default {
  components: { SideNav, Collection, EmptyItem },
  data() {
    return {
      collectionsExpands: [0, 1, 2, 3, 4, 5],
    };
  },
  computed: {
    isEmpty() {
      const list = this.$store.getters['collections/list'];
      return typeof list === 'object' && list.length === 0;
    },
    dataFiltered() {
      const { activeTag } = this.$store.state;
      if (activeTag === 'all_tags#e4e4e4') {
        return this.$store.getters['collections/list'];
      }
      return this.$store.getters['collections/list'].filter(item => item.tags.some(tag => tag.id === activeTag));
    },
  },
};
</script>
<style lang="scss">
.collection-expansion::before {
  box-shadow: none !important;
}
.collection-tag {
  i {
    font-size: 18px !important;
  }
}

.ghost-card * {
  display: none;
  width: 200px;
  height: 150px;
}

.ghost-card {
  margin-top: 10px;
  height: 140px;
  width: 225px;
  background-color: #00000008;
}
</style>
