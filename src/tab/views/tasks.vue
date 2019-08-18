<template>
  <div class="tasks-container">
    <div class="scroller">
      <template v-for="(column, columnIndex) in lists">
        <column-tasks :column="column" :columnIndex="columnIndex" v-show="filterData(column)"></column-tasks>
      </template>
      <div class="add-column" @click="createItem('tasks/createItem')">
        <span class="icon">
          <i class="el-icon-plus"></i>
        </span>
        <p class="title">Add Tasks Column</p>
      </div>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable';
import Tag from '../../mixins/tag';
import createItem from '../../mixins/create-item';
import ColumnTasks from '../components/tasks/column-tasks';
export default {
  mixins: [Tag('tasks/list'), createItem],
  components: { Draggable, ColumnTasks },
  computed: {
    lists() {
      return this.$store.getters['tasks/list'];
    },
  },
};
</script>
<style lang="scss">
@import '../../assets/themes/themes';

.column-tags {
  padding-right: 20px;
}

.tasks-scroller {
  height: 100%;
  margin-top: 5px;

  .el-scrollbar__wrap {
    overflow-x: hidden;
    padding-right: 20px;
  }
}

.collection-tag.task {
  margin-top: 5px;
}

.task-handler {
  cursor: grab;
  margin-left: 10px;
}

.tasks-body {
  min-height: 150px;
}

.add-column {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @include themify($themes) {
    background-color: themed('bg-color');
    border: 2px dashed themed('light-border');
  }
  width: 340px;
  border-radius: 4px;
  flex: 0 0 auto;
  transition: all 0.1s ease;
  .title {
    font-size: 16px;
    color: #606266;
    margin-top: 5px;
  }

  &:hover {
    @include themify($themes) {
      background-color: themed('hover');
    }

    .icon {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
  }

  .icon {
    transition: all 0.3s ease;
    padding: 13px 14px;
    border-radius: 30px;
    @include themify($themes) {
      background-color: themed('bg-color2');
      color: themed('text-placeholder');
    }
    font-size: 16px;
  }
}

.column-popover-btn {
  font-size: 18px;
  margin-left: 10px;
  vertical-align: middle;
  color: #c1c1c1;
  cursor: pointer;
}

.column-header {
  .column-utils {
    display: inline-block;
  }

  .column-title {
    font-weight: 600;
    display: inline-block;
    font-size: 16px;
    margin: 0;
  }
}

.tasks-column {
  .el-card__body {
    padding-top: 10px !important;
    height: 83%;
    padding-right: 0px !important;
  }

  .el-card__header {
    padding: 14px 16px;
  }
}

.tasks-container {
  height: calc(100% - 60px);

  .scroller {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    height: 100%;
    padding: 15px;
    box-sizing: border-box;

    .tasks-column {
      width: 340px;
      flex: 0 0 auto;
      margin: 0 10px;
    }
  }
}
</style>
