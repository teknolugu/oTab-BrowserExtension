<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="collection-header">
          <el-button size="medium" type="primary" icon="el-icon-plus" @click="createItem('collections/createCollection')">Create Collection</el-button>
          <el-button :disabled="openTabs.length === 0" size="medium" @click="saveSession" plain>Save Session</el-button>
          <el-input size="medium" placeholder="Search items" clearable v-model="search" @focus="isSearch = true" @blur="isSearch = false">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <el-collapse v-model="activeCollapse" v-if="collections.length !== 0">
          <template v-for="(collection, collectionIndex) in collections">
            <el-collapse-item :name="collectionIndex" class="collapse-collection" v-show="filterData(collection)">
              <div slot="title" style="width: 100%">
                <span class="capitalize collapse-title">{{ collection.title }}</span>
                <el-tag
                  effect="dark"
                  @click.stop="activeTag(tag.id)"
                  class="capitalize collection-tag"
                  size="small"
                  closable
                  v-for="tag in collection.tags"
                  :color="tag.color"
                  :key="tag.id"
                  @close="delCollectionTag(tag.id, collectionIndex)"
                >
                  {{ tag.name }}
                </el-tag>
                <div class="right">
                  <el-button type="primary" plain class="capitalize open-all-tabs-btn" size="mini" @click.stop="openAllTabs(collection.tabs)"
                    >open {{ collection.tabs.length }} tabs</el-button
                  >
                  <popover-menu
                    name="Collection"
                    class="item-popover"
                    direction="left"
                    @editTitle="editTitle"
                    @addTag="addTag"
                    @delete="deleteCollection"
                    :index="collectionIndex"
                    :items="collection"
                  >
                    <div class="el-list-item" @click="addHomeCollection(collectionIndex)">
                      <div class="el-list-icon">
                        <i class="el-icon-plus"></i>
                      </div>
                      <div class="el-list-text">
                        <p>Add to home</p>
                      </div>
                    </div>
                    <el-button icon="el-icon-more" type="text" slot="activator"></el-button>
                  </popover-menu>
                </div>
              </div>
              <Draggable
                class="list-group custom-flex"
                ghost-class="ghost-card"
                v-model="collection.tabs"
                group="tabs"
                tag="el-row"
                handle=".drag-handle"
                :component-data="getComponentData"
                :key="collection.id"
              >
                <el-col v-for="(tab, index) in searchHandle(collection.tabs, 'title', 'url')" :key="index" class="tab-card-col" :xl="4">
                  <tab-card :tab="tab" :index="index" :collectionIndex="collectionIndex"></tab-card>
                </el-col>
              </Draggable>
            </el-collapse-item>
          </template>
        </el-collapse>
        <div class="no-open-tabs" v-else>
          <div class="no-open-tabs-icon">
            <span>
              <unicon height="35px" width="35px" name="layers"></unicon>
            </span>
          </div>
          <div class="no-open-tabs-content" style="margin-top: 10px">
            <p>You not have any collection, click <strong>Create Collection</strong> to create new one</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="side-navigation">
        <el-scrollbar class="side-nav-scrollbar" :native="false">
          <SideNav @change="getOpenTabs"></SideNav>
        </el-scrollbar>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>
import Draggable from 'vuedraggable';
import SideNav from '../components/collections/side-nav';
import TabCard from '../components/collections/tab-card';
import PopoverMenu from '../components/popover-menu';
import SearchItem from '../../mixins/search-item';
import createItem from '../../mixins/create-item';
import Tag from '../../mixins/tag';
export default {
  components: { SideNav, Draggable, TabCard, PopoverMenu },
  mixins: [SearchItem, Tag('collections/list'), createItem],
  data() {
    return {
      openTabs: [],
      delCollectionPromt: false,
      activeCollapse: [0, 1, 2, 3],
      getComponentData: {
        props: {
          gutter: 10,
        },
      },
    };
  },
  methods: {
    addHomeCollection(collectionIndex) {
      let activeBoard = this.$store.state.activeBoard;
      const collectionId = `${activeBoard}=>${collectionIndex}`;
      this.$browser.storage.sync.set({ homeCollection: collectionId });
      this.$store.commit('homeCollection', collectionId);
      this.$message.success('Add collection to home');
    },
    getOpenTabs(tabs) {
      this.openTabs = tabs;
    },
    saveSession() {
      let date = new Date(Date.now()).toString();
      let collectionName = date.slice(4, 10) + ', ' + date.slice(16, 21);
      this.$store.commit('collections/createCollection', { title: collectionName, tabs: [...this.openTabs] });
      this.$browser.tabs.remove(this.openTabs.map(tab => tab.id));
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
        index: index,
      });
    },
    addTag({ select, index }) {
      this.$store.dispatch('collections/addCollectionTag', { select: select, index: index });
    },
    activeTag(tagId) {
      this.$store.commit('activeTag', tagId);
    },
    delCollectionTag(tagId, collectionIndex) {
      this.$store.commit('collections/delCollectionTag', { tagId, collectionIndex });
    },
  },
  computed: {
    collections() {
      return this.$store.getters['collections/list'];
    },
  },
};
</script>
<style lang="scss">
@import '../../assets/themes/themes';

@media only screen and (min-width: 1264px) {
  .tab-card-col.el-col.el-col-24.el-col-xl-4 {
    width: 24%;
  }
}

@media only screen and (min-width: 1920px) {
  .tab-card-col.el-col.el-col-24.el-col-xl-4 {
    width: 16%;
  }
}

.empty-collection {
  height: 50px;
}

.custom-flex {
  min-height: 40px;
  margin: 0 !important;
  display: flex !important;
  flex-flow: row wrap !important;
}

.open-all-tabs-btn {
  margin-right: 10px !important;
}

.option-tag {
  padding: 2px 5px !important;

  p {
    height: 100%;
    padding: 3px 10px;
    box-sizing: border-box;
    color: white;
    text-transform: capitalize;
    border-radius: 4px;
  }
}

.collection-tag {
  border: 1px solid transparent !important;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.05);
  }

  i:hover {
    color: #fff;
    background-color: #0000000f !important;
  }
}

.add-tab-card-col {
  height: 163px;
  padding: 10px;
}

.collection-header {
  margin-bottom: 10px;

  .el-input {
    width: 230px;
    float: right;
  }
}

.tab-card-col {
  height: 163px;
}

.ghost-card * {
  display: none;
}

.ghost-card {
  margin-left: 1px !important;
  height: 130px;
  margin-top: 10px !important;
  width: 220px;
  @include themify($themes) {
    background-color: themed('bg-color2') !important;
  }
}

.collapse-title {
  font-size: 16px;
  font-weight: 600;
  @include themify($themes) {
    color: themed('text-primary');
  }
  margin-right: 15px;
}

.side-navigation {
  position: fixed;
  right: 10px;
  padding-right: 7px !important;
  height: 85%;
}

.side-nav-scrollbar {
  height: 100%;
  @include themify($themes) {
    border-left: 1px solid themed('base-border');
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
