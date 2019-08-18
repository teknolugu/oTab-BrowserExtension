<template>
  <el-dialog :visible.sync="visible" width="50%" class="settings-dialog">
    <el-tabs :value="activeTab">
      <el-tab-pane name="home">
        <span slot="label" class="setting-tab-title"><i class="el-icon-picture"></i> Home Theme</span>
        <home-settings @change="commitSetting"></home-settings>
      </el-tab-pane>
      <el-tab-pane name="general">
        <span slot="label" class="setting-tab-title"><i class="el-icon-s-tools"></i> General</span>
        <general-settings :settings="settings" @change="commitSetting"></general-settings>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="primary">Close</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Bus from '../../utils/bus';
import GeneralSettings from './general-settings';
import HomeSettings from './home-settings';
export default {
  components: { GeneralSettings, HomeSettings },
  data: () => ({
    activeTab: '',
    visible: false,
  }),
  methods: {
    commitSetting(payload) {
      this.$store.commit('settings/change', payload);
      this.$browser.storage.sync.set({ oTabSettings: this.settings });
    },
  },
  computed: {
    settings() {
      return this.$store.state.settings.items;
    },
  },
  created() {
    Bus.$on('settings', name => {
      this.visible = true;
      this.activeTab = name;
    });
  },
};
</script>
<style lang="scss">
@import '../../../assets/themes/themes';

.list-subtitle {
  margin-bottom: 5px;
  @include themify($themes) {
    color: themed('text-secondary');
  }
}

.el-list.settings {
  box-shadow: 0 0 1px 1px #607d8b08, 1px 1px 10px #4341571a;
  border-radius: 4px;

  @include themify($themes) {
    border: 1px solid themed('light-border');
    background-color: themed('card');
  }

  .el-list-item {
    border-radius: 0;

    .el-list-icon {
      min-width: 50px !important;
    }

    padding: 13px 10px;

    @include themify($themes) {
      border-bottom: 1px solid themed('light-border');
    }

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: unset !important;
    }
  }
}
.setting-tab-title {
  i {
    margin-right: 3px;
  }
  font-size: 15px;
}

.settings-dialog {
  .el-tabs__content {
    padding: 10px;
  }

  .el-dialog__header {
    .el-dialog__headerbtn {
      top: 25px !important;
      right: 30px !important;
      z-index: 2;
      i {
        font-size: 21px;
      }
    }

    @include themify($themes) {
      border-bottom: 1px solid themed('base-border');
    }

    padding: 0px 20px !important;
  }

  .el-dialog__footer {
    padding: 10px 20px !important;
  }

  .el-dialog__body {
    min-height: 200px;
    padding: 20px 30px !important;
  }
}
</style>
