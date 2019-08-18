<template>
  <div class="task-card" :class="{ checked: task.done, isEdit: edit }">
    <el-checkbox size="medium" class="checkbox-task" :value="task.done" @change="changeStatus({ columnIndex, taskIndex, data: !task.done })"></el-checkbox>
    <el-input
      placeholder="Task name"
      size="mini"
      class="editTask-input"
      :value="task.name"
      @blur="editTaskHandler(columnIndex, taskIndex)"
      @keyup.enter.native="editTaskHandler(columnIndex, taskIndex)"
      v-if="edit || task.name === ''"
      v-model="value"
      @focus="setEditActive(task.name)"
    ></el-input>
    <p :title="task.name" class="task-name" @click="setEditActive(task.name)" v-else>{{ task.name }}</p>
    <unicon name="grip-horizontal-line" class="task-handler right" fill="#a6a6a6" />
    <el-button type="danger" size="mini" plain icon="el-icon-delete" class="delete-task right" circle @click="delTask(columnIndex, taskIndex)"></el-button>
  </div>
</template>
<script>
export default {
  props: ['columnIndex', 'editTask', 'task', 'taskIndex'],
  data: () => ({
    edit: false,
    value: '',
  }),
  methods: {
    delTask(columnIndex, taskIndex) {
      this.$store.commit('tasks/delTask', { columnIndex, taskIndex });
    },
    clearAll() {
      this.edit = false;
      this.value = '';
    },
    setEditActive(value) {
      this.edit = true;
      this.value = value;
    },
    changeStatus(payload) {
      this.$store.commit('tasks/editTask', { ...payload, type: 'status' });
    },
    editTaskHandler(columnIndex, taskIndex) {
      this.$store.commit('tasks/editTask', { columnIndex, taskIndex, data: this.value, type: 'value' });
      this.clearAll();
    },
  },
};
</script>
<style lang="scss">
@import '../../../assets/themes/themes';

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
    border: 1px solid #409eff !important;
  }

  &:hover {
    .delete-task {
      visibility: visible;
      opacity: 1;
    }
  }

  border-radius: 4px;
  @include themify($themes) {
    border: 1px solid themed('light-border');
  }
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
