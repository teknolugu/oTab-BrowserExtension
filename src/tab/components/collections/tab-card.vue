<template>
  <el-card class="box-card" :class="{ 'edit-mode': editMode }">
    <div slot="header" class="tab-header">
      <div class="header-image">
        <el-image :src="tab.favIconUrl" class="header-favicon" v-if="tab.favIconUrl">
          <span slot="error" class="header-error-favicon">
            <i class="el-icon-picture-outline-round"></i>
          </span>
        </el-image>
        <span class="header-no-favicon" v-else>
          <i class="el-icon-picture-outline-round"></i>
        </span>
        <div class="header-image-utils" align="right">
          <template v-if="editMode">
            <el-button size="mini" @click="clearAll">Cancel</el-button>
            <el-button size="mini" type="primary" @click="editTab">Done</el-button>
          </template>
          <template v-else>
            <unicon name="multiply" height="20px" @click="deleteTab(index)" width="20px" title="edit" class="tab-delete-icon" fill="#a6a6a6" />
            <unicon name="pen" height="20px" width="20px" title="edit" class="tab-edit-icon" fill="#a6a6a6" @click="editTabActive(tab)" />
            <unicon name="grip-horizontal-line" class="drag-handle" fill="#a6a6a6" />
          </template>
        </div>
      </div>
      <div class="header-content">
        <el-input size="small" resize="none" autosize type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" placeholder="Title" v-model="edit.title" v-if="editMode"> </el-input>
        <p class="tab-title" :title="tab.title" v-else>{{ tab.title }}</p>
        <p class="tab-url-host" v-show="!editMode">{{ tab.url | getHost }}</p>
      </div>
    </div>
    <el-input
      class="copy-url"
      placeholder="URL"
      v-model="edit.url"
      :readonly="!editMode"
      size="mini"
      v-if="copyUrl || editMode"
      :autofocus="!editMode"
      :id="'copy' + index"
    ></el-input>
    <p class="tab-url" :title="tab.url + ' | click to copy'" @click="copyToClipboard('copy' + index, tab.url)" v-else>{{ tab.url }}</p>
    <span class="open-new-tab" @click="openNewTab(tab.url)">
      <i class="el-icon-top-right"></i>
    </span>
  </el-card>
</template>
<script>
import Bus from '../../utils/bus';
import url from 'url';
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
      let parseURL = url.parse(value);
      return parseURL.host;
    },
  },
  methods: {
    editTab() {
      if (this.edit.title === '' || this.edit.url === '') {
        this.$message({
          message: 'Tab Title/URL is blank',
          type: 'warning',
        });
      } else {
        this.$store.commit('collections/editTab', {
          ...this.edit,
          collectionIndex: this.$props.collectionIndex,
          index: this.$props.index,
        });
        this.clearAll();
      }
    },
    editTabActive(tab) {
      this.edit = { ...tab };
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
        document.querySelector(`#${id}`).select();
        document.execCommand('copy');
      }, 100);
      setTimeout(() => {
        this.copyUrl = false;
      }, 1500);
    },
    deleteTab(tabIndex) {
      let collectionIndex = this.$props.collectionIndex;
      this.$store.commit('collections/removeCollectionTab', { tabIndex: tabIndex, collectionIndex: collectionIndex });
    },
    openNewTab(link) {
      window.open(link);
    },
  },
  created() {
    Bus.$on('changeBoard', this.clearAll);
  },
};
</script>
<style lang="scss">
$transition-icon: all 0.2s ease;

.copy-url {
  width: 78% !important;
  margin-right: 10px;

  input {
    padding-left: 7px;
  }
}

.edit-mode {
  .header-image {
    margin-bottom: 7px;
  }
}

.header-image {
  display: flex;
  align-items: center;
}

.header-image-utils {
  svg {
    transition: $transition-icon;
  }
}

.open-new-tab {
  padding: 5px;
  background: #f9f9f9;
  cursor: pointer;
  border-radius: 30px;

  i {
    font-size: 16px;
    vertical-align: text-top;
  }
}

.tab-delete-icon {
  color: #a6a6a6;
  margin-right: 3px;
  font-size: 24px;
  opacity: 0;
  cursor: pointer;
}

.tab-delete-icon:hover {
  fill: #f56c6c;
}

.tab-edit-icon {
  margin-right: 6px;
  cursor: pointer;
  opacity: 0;
}

.tab-edit-icon:hover {
  fill: #409eff;
}

.box-card {
  transition: all 0.3s ease;
  margin-top: 10px;

  .el-card__body {
    padding: 10px;
  }

  .tab-url {
    font-size: 14px;
    display: inline-block;
    width: 78%;
    margin: 0;
    margin-right: 10px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
    white-space: nowrap;
  }
}

.box-card:hover {
  .tab-edit-icon,
  .tab-delete-icon {
    opacity: 1;
  }
}

.drag-handle {
  vertical-align: sub;
  &:hover {
    fill: #686868;
  }

  cursor: -webkit-grab;
}

.header-image-utils {
  width: 100%;
}

.header-error-favicon {
  font-size: 26px;
  vertical-align: bottom;
}

.header-no-favicon {
  vertical-align: super;
  font-size: 26px;
  margin-right: 6px;
}

.box-card {
  .el-card__header {
    padding: 11px 13px !important;
  }
}

.tab-header {
  .header-favicon {
    width: 26px;
    margin-right: 6px;
  }
}

.header-content {
  display: inline-block;
  width: 100%;
  textarea {
    padding: 5px 10px;
  }
  p {
    margin: 0;
  }

  .tab-title {
    color: #606266;
    line-height: 1.2;
    font-size: 15px;
    font-weight: 600;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    max-height: 36px;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .tab-url-host {
    line-height: 1.2;
    font-size: 13px;
    color: #606266;
  }
}
</style>
