<template>
  <div class="open-tabs">
    <p class="open-tabs-title">Open Tabs</p>
    <Draggable :clone="cloneTab" class="list-group" :list="openTabs" :group="groupOptions" style="min-height: 200px" v-if="openTabs.length !== 0">
      <el-card shadow="never" class="tabs-card" v-for="(tab, index) in openTabs" :key="index + tab.url">
        <div class="tabs-favicon">
          <el-image :src="tab.favIconUrl" v-if="tab.favIconUrl">
            <i class="el-icon-picture-outline-round" slot="error"></i>
          </el-image>
          <i class="el-icon-picture-outline-round" v-else></i>
        </div>
        <div class="tabs-content">
          <p class="tabs-title">{{ tab.title }}</p>
          <p class="tabs-url">{{ tab.url }}</p>
        </div>
        <unicon name="grip-horizontal-line" fill="#a6a6a6" />
      </el-card>
    </Draggable>
    <div class="no-open-tabs" v-else>
      <div class="no-open-tabs-icon">
        <span>
          <unicon height="35px" width="35px" name="window"></unicon>
        </span>
      </div>
      <div class="no-open-tabs-content">
        <p>There's no open tabs</p>
      </div>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable';
import openTabs from '../../../mixins/open-tabs';
export default {
  components: { Draggable },
  mixins: [openTabs],
  data: () => ({
    groupOptions: { name: 'tabs', pull: 'clone', put: false, revertClone: true },
  }),
  methods: {
    cloneTab(tab) {
      let copyTab = { ...tab };
      return copyTab;
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
};
</script>
<style lang="scss">
@import '../../../assets/themes/themes';
.no-open-tabs {
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: center;
  padding: 20px;
  align-items: center;
}

.no-open-tabs-content {
  font-size: 16px;
  font-weight: 500;
  color: #818181;
}

.no-open-tabs-icon {
  svg {
    vertical-align: bottom;
    fill: #9e9e9e;
  }

  margin-bottom: 5px;
  padding: 20px;
  @include themify($themes) {
    background-color: themed('bg-color2');
  }
  border-radius: 50px;
}

.open-tabs-title {
  margin: 0 20px;
  font-weight: 600;
}

.tabs-favicon {
  margin-right: 10px;

  .el-image {
    width: 25px;
  }

  i {
    font-size: 25px;
  }
}

.tabs-title {
  font-weight: 600;
  @include themify($themes) {
    color: themed('text-primary');
  }
  line-height: 1.4;
}

.tabs-url {
  @include themify($themes) {
    color: themed('text-regular');
  }
  font-size: 13px;
  line-height: 1.3;
}

.tabs-content {
  width: calc(100% - 65px);
  margin-right: 10px;

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
}

.tabs-card {
  cursor: grab;
  transition: border 0.2s ease !important;
  &:hover {
    @include themify($themes) {
      background-color: themed('hover');
    }
    border-left: 3px solid #20a0ff;
  }

  margin: 10px 20px 0 20px;

  .el-card__body {
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 13px;
  }

  .tabs-favicon {
    display: inline-block;
  }

  .tabs-content {
    display: inline-block;
  }
}
</style>
