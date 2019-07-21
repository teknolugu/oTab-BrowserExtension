<template>
  <div class="task-card" :class="{ checked: task.done, isEdit: isEdit(taskIndex, columnIndex) }">
    <el-checkbox size="medium" class="checkbox-task" :value="task.done" @change="changeStatus({ columnIndex, taskIndex, data: !task.done })"></el-checkbox>
    <el-input
      placeholder="Task name"
      size="mini"
      class="editTask-input"
      autofocus
      :value="task.name"
      @blur="editTaskHandler"
      @keyup.enter.native="editTaskHandler"
      v-if="isEdit(taskIndex, columnIndex, task.name)"
      v-model="activeEditTask.value"
      @focus="setEditActive(columnIndex, taskIndex, task.name)"
    ></el-input>
    <p :title="task.name" class="task-name" @click="setEditActive(columnIndex, taskIndex, task.name)" v-else>{{ task.name }}</p>
    <unicon name="grip-horizontal-line" class="task-handler right" fill="#a6a6a6" />
    <el-button type="danger" size="mini" plain icon="el-icon-delete" class="delete-task right" circle @click="delTask(columnIndex, taskIndex)"></el-button>
  </div>
</template>
<script>
export default {
  props: ['columnIndex', 'editTask', 'task', 'taskIndex'],
  data: () => ({
    activeEditTask: {
      column: null,
      index: null,
      value: '',
    },
  }),
  watch: {
    editTask: {
      handler(task) {
        this.activeEditTask = task;
      },
      deep: true,
    },
  },
  methods: {
    isEdit(taskIndex, columnIndex, value) {
      return (this.activeEditTask.index === taskIndex && this.activeEditTask.column === columnIndex) || value === '' ? true : false;
    },
    delTask(columnIndex, taskIndex) {
      this.$store.commit('tasks/delTask', { columnIndex, taskIndex });
    },
    clearAll() {
      this.activeEditTask = {
        column: null,
        index: null,
        id: null,
      };
    },
    setEditActive(columnIndex, taskIndex, value) {
      this.activeEditTask = {
        column: columnIndex,
        index: taskIndex,
        value: value,
      };
    },
    changeStatus(payload) {
      this.$store.commit('tasks/editTask', { ...payload, type: 'status' });
    },
    editTaskHandler() {
      let activeEditTask = this.activeEditTask;
      this.$store.commit('tasks/editTask', { columnIndex: activeEditTask.column, taskIndex: activeEditTask.index, data: activeEditTask.value, type: 'value' });
      this.clearAll();
    },
  },
};
</script>
<style lang="scss">
.checked {
  .task-name {
    color: #c0c4cc;
    text-decoration: line-through;
    font-style: italic;
  }
}

.editTask-input {
  input {
    font-size: 14px;
    padding: 0 !important;
    border: none !important;
  }

  width: 65% !important;
}

.delete-task {
  visibility: hidden;
  transition: all 0.2s ease;
  opacity: 0;
}

.task-card {
  &.isEdit {
    border: 1px solid #409eff;
  }

  &:hover {
    .delete-task {
      visibility: visible;
      opacity: 1;
    }
  }

  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 10px 13px;
  margin-top: 10px;

  &:first-child {
    margin-top: 15px;
  }

  label {
    margin-right: 10px;
  }

  .task-name {
    text-overflow: ellipsis;
    display: inline-block;
    margin: 0;
    overflow: hidden;
    width: 65%;
    vertical-align: middle;
    white-space: nowrap;
  }
}
</style>
