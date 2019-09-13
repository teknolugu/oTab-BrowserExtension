<template>
  <v-card class="side-nav-open-tabs fill-height" :max-height="sideNavMaxHeight">
    <div class="d-flex align-center pa-4 justify-space-between">
      <span class="grey--text body-2 text-uppercase">open tabs</span>
      <v-btn small color="info" depressed @click="saveSession" :disabled="openTabs.length === 0">Save session</v-btn>
    </div>
    <v-card-text class="pt-0 scroller side-nav-open-tabs--content">
      <Draggable :clone="cloneTab" class="list-group" ghost-class="ghost-card" :list="openTabs" :group="groupOptions" style="min-height: 200px" v-if="openTabs.length !== 0">
        <v-card outlined v-for="(tab, index) in openTabs" :key="index" class="tab-card">
          <v-list-item dense @click.stop>
            <v-list-item-icon class="mr-3 my-3">
              <v-img contain width="30px" :src="tab.favIconUrl"></v-img>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ tab.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ tab.url }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>{{ $icons.mdiDrag }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </Draggable>
      <empty-item v-else title="You have no open tabs" :icon="$icons.mdiWeb"></empty-item>
    </v-card-text>
  </v-card>
</template>
<script>
import Draggable from 'vuedraggable';
import openTabs from '../../../mixins/open-tabs';
import EmptyItem from '../empty-item';

export default {
  components: { Draggable, EmptyItem },
  mixins: [openTabs],
  data: () => ({
    groupOptions: { name: 'tabs', pull: 'clone', put: false, revertClone: true },
  }),
  methods: {
    cloneTab(tab) {
      const copyTab = { ...tab };
      return copyTab;
    },
    saveSession() {
      const date = new Date(Date.now()).toString();
      const collectionName = `${date.slice(4, 10)}, ${date.slice(16, 21)}`;
      this.$store.commit('collections/createCollection', { title: collectionName, tabs: [...this.openTabs] });
      this.$browser.tabs.remove(this.openTabs.map(tab => tab.id));
    },
  },
  watch: {
    openTabs: {
      handler(tabs) {
        this.$emit('change', tabs);
      },
      deep: true,
    },
  },
  computed: {
    sideNavMaxHeight() {
      return window.innerHeight - 140;
    },
  },
};
</script>
<style lang="scss">
.side-nav-open-tabs {
  &--content {
    max-height: calc(100% - 80px);
    overflow: auto;
  }
  position: sticky;
  top: 75px;
  // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important
}
.tab-card {
  margin-top: 9px;
  cursor: grab;
  &:first-child {
    margin-top: 0;
  }
}
</style>
