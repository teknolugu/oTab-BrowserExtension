<template>
  <v-card hover class="tab-card-comp">
    <a :href="tab.url" :target="tabTarget" class="tab-link" v-show="!editMode"></a>
    <v-card-title>
      <v-img height="26px" max-width="23px" width="23px" contain :src="tab.favIconUrl"></v-img>
      <div class="flex-grow-1"></div>
      <div class="d-flex flex-row align-center clickable">
        <template v-if="!editMode">
          <v-icon title="Delete" color="error" class="tab-content-action" @click="deleteTab(index)">{{ $icons.mdiClose }}</v-icon>
          <v-icon title="Edit" color="primary" class="mx-1 tab-content-action" style="font-size: 21px" @click="activateEditTab">{{ $icons.mdiPencil }}</v-icon>
          <v-icon class="drag-handle">{{ $icons.mdiDrag }}</v-icon>
        </template>
        <template v-else>
          <v-btn small text class="mr-2" @click="clearAll">Cancel</v-btn>
          <v-btn small color="primary" depressed @click="editTab">Save</v-btn>
        </template>
      </div>
    </v-card-title>
    <v-card-text class="pb-2">
      <template v-if="!editMode">
        <p class="mb-0 font-weight-medium tab-card-title">{{ tab.title }}</p>
        <p class="mb-0 body-2">{{ tab.url | getHost }}</p>
      </template>
      <v-text-field class="pt-0" hide-details v-model="edit.title" v-else></v-text-field>
    </v-card-text>
    <v-card-actions class="tab-card-actions grey--text bg-card">
      <v-text-field
        v-model="edit.url"
        solo
        flat
        v-if="copyUrl || editMode"
        :id="'copy' + index"
        hide-details
        class="tab-card-url"
        :autofocus="copyUrl"
        :readonly="copyUrl"
        height="14px"
      ></v-text-field>
      <div class="tab-card-url-content d-flex align-center" v-else>
        <p class="body-2 ma-0 text-truncate" :title="tab.url">{{ tab.url }}</p>
        <v-icon small title="Click to copy URL" class="ml-2 clickable background" @click="copyToClipboard(index, tab.url)">{{ $icons.mdiContentCopy }}</v-icon>
      </div>
    </v-card-actions>
  </v-card>
</template>
<script>
import url from 'url';
import Bus from '../../utils/bus';

export default {
  props: {
    tab: {
      type: Object,
      default: () => {
        return {
          title: 'Some Title',
          url: 'https://somedomain.com',
          favIconUrl: '',
        };
      },
    },
    index: {
      type: Number,
      default: 0,
    },
    collectionIndex: Number,
  },
  data: () => ({
    editMode: false,
    edit: {
      title: '',
      url: '',
    },
    copyUrl: false,
  }),
  filters: {
    getHost(value) {
      const parseURL = url.parse(value);
      return parseURL.host;
    },
  },
  computed: {
    tabTarget() {
      return this.$store.state.settings.items.openInCurrentTab ? '_self' : '_blank';
    },
  },
  methods: {
    editTab() {
      if (this.edit.title === '' || this.edit.url === '') {
        this.$dialog.notify.error('Tab Title/URL is blank');
      } else {
        this.$store.commit('collections/editTab', {
          ...this.edit,
          collectionIndex: this.$props.collectionIndex,
          index: this.$props.index,
        });
        this.clearAll();
      }
    },
    activateEditTab() {
      this.edit = { ...this.$props.tab };
      this.editMode = true;
    },
    clearAll() {
      this.editMode = this.copyUrl = false;
      this.edit.title = this.edit.url = '';
    },
    copyToClipboard(id, url) {
      this.edit.url = url;
      this.copyUrl = true;
      setTimeout(() => {
        document.querySelector(`#copy${id}`).select();
        document.execCommand('copy');
      }, 100);
      setTimeout(() => {
        this.copyUrl = false;
      }, 1500);
    },
    deleteTab(tabIndex) {
      const { collectionIndex } = this.$props;
      this.$store.commit('collections/removeCollectionTab', { tabIndex, collectionIndex });
    },
  },
  created() {
    Bus.$on('changeBoard', this.clearAll);
  },
};
</script>
<style lang="scss">
.drag-handle {
  cursor: grab;
}
.tab-card-comp {
  &.theme--dark {
    border: 1px solid #595959;
  }
  .tab-content-action {
    cursor: pointer;
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s ease;
  }
  &:hover {
    .tab-content-action {
      visibility: visible;
      opacity: 1;
    }
  }
  .clickable {
    z-index: 1;
  }
  .tab-link {
    z-index: 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
}
.tab-card-url-content {
  width: 100%;
  p {
    width: 95%;
    display: inline-block;
  }
  i {
    padding: 5px;
    // position: absolute;
    // right: 16px;

    cursor: pointer;
    border-radius: 30px;
  }
}

.tab-card-url {
  .v-input__control {
    border: 1px solid #0000001a;
    height: 27px;
    min-height: 25px !important;
    font-size: 14px;
  }
}
.tab-card-title {
  line-height: 1.2rem !important;
  font-size: 15px !important;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  max-height: 36px;
  overflow: hidden;
  -webkit-box-orient: vertical;
}
.tab-card-actions {
  padding: 10px 17px;
}
</style>
