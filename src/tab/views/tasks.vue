<template>
  <div class="tasks-container">
    <div class="scroller">
      <el-card v-for="(column, columnIndex) in lists" class="tasks-column" :key="columnIndex" v-show="filterData(column)">
        <div class="column-header" slot="header">
          <p class="column-title capitalize">{{ column.title }}</p>
          <div class="right column-utils">
            <el-button icon="el-icon-plus" @click="newTask(columnIndex)" class="more-icon" size="mini" circle></el-button>
            <popover-menu name="Column" @editTitle="editTitle" @addTag="addTag" @delete="deleteColumn" direction="bottom" :index="columnIndex" :items="column">
              <span class="column-popover-btn">
                <i class="el-icon-more"></i>
              </span>
            </popover-menu>
          </div>
        </div>
        <div class="column-tags">
          <el-tag
            effect="dark"
            class="capitalize task collection-tag"
            size="medium"
            @close="delTag(tag.id, columnIndex)"
            @click="activeTag(tag.id)"
            closable
            v-for="tag in column.tags"
            :color="tag.color"
            :key="tag.id"
          >
            {{ tag.name }}
          </el-tag>
        </div>
        <el-scrollbar class="tasks-scroller" :native="false">
          <Draggable class="tasks-body" ghost-class="ghost-tasks" group="tasks" handle=".task-handler" v-model="column.tasks" @start="clearAll">
            <div class="no-open-tabs" v-if="column.tasks.length === 0">
              <div class="no-open-tabs-icon">
                <span>
                  <unicon height="35px" width="35px" name="clipboard-notes"></unicon>
                </span>
              </div>
              <div class="no-open-tabs-content">
                <p>It's Empty</p>
              </div>
            </div>
            <template v-for="(task, taskIndex) in column.tasks" v-else>
              <task-card :task="task" :taskIndex="taskIndex" :editTask="editTask" :columnIndex="columnIndex"></task-card>
            </template>
          </Draggable>
        </el-scrollbar>
      </el-card>
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
import PopoverMenu from '../components/popover-menu';
import TaskCard from '../components/tasks/task-card.vue';
export default {
  mixins: [Tag('tasks/list'), createItem],
  components: { TaskCard, Draggable, PopoverMenu },
  data: () => ({
    editTask: {
      column: null,
      index: null,
      value: '',
    },
  }),
  methods: {
    delTag(tagId, columnIndex) {
      this.$store.commit('tasks/delTag', { tagId, columnIndex });
    },
    activeTag(tagId) {
      this.$store.commit('activeTag', tagId);
    },
    editTitle(payload) {
      this.$store.commit('tasks/editTitle', { ...payload });
    },
    deleteColumn(index) {
      this.$store.commit('tasks/deleteItem', index);
    },
    addTag({ select, index }) {
      this.$store.dispatch('tasks/addTaskTag', { select: select, index: index });
    },
    clearAll() {
      this.editTask = {
        column: null,
        index: null,
        value: '',
      };
    },
    newTask(columnIndex) {
      this.$store.commit('tasks/newTask', columnIndex);
      this.editTask.column = columnIndex;
      let lastTask = this.lists[columnIndex].tasks.length - 1;
      this.editTask.index = lastTask;
    },
  },
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
  @include themify($themes){
    background-color: themed('bg-color');
    border: 2px dashed themed('light-border');
  }
  width: 340px;
  border-radius: 4px;
  flex: 0 0 auto;
  transition: all .1s ease;
  .title {
    font-size: 16px;
    color: #606266;
    margin-top: 5px;
  }

  &:hover {
    @include themify($themes){
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
    @include themify($themes){
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
