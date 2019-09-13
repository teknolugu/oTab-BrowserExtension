<template>
  <v-card class="task-card" outlined :class="{ 'checked background2': task.done, isEdit: edit }">
    <v-list-item dense :ripple="false" @click.stop>
      <v-list-item-icon class="mr-1">
        <v-checkbox v-model="checkbox" hide-details color="primary" class="ma-0"></v-checkbox>
      </v-list-item-icon>
      <v-list-item-content @click="setEditActive" :title="task.name">
        <v-text-field
          hide-details
          class="pt-0 mt-0 task-input"
          @blur="editTask(value, 'value')"
          v-if="edit || task.name === ''"
          v-model="value"
          placeholder="Task name..."
        ></v-text-field>
        <span class="task-name text-truncate" v-else>{{ task.name }}</span>
      </v-list-item-content>
      <v-list-item-action class="ml-1 d-inline-block">
        <v-btn small icon color="error" @click="delTask" class="delTask-btn">
          <v-icon>{{ $icons.mdiDeleteOutline }}</v-icon>
        </v-btn>
        <v-icon class="task-handle">{{ $icons.mdiDrag }}</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>
<script>
export default {
  props: {
    columnIndex: {
      type: Number,
      default: 0,
    },
    task: {
      type: Object,
      default: () => ({
        done: '',
        name: '',
      }),
    },
    taskIndex: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    edit: false,
    value: '',
  }),
  methods: {
    delTask() {
      this.$store.commit('tasks/delTask', { columnIndex: this.$props.columnIndex, taskIndex: this.$props.taskIndex });
    },
    clearAll() {
      this.edit = false;
      this.value = '';
    },
    setEditActive() {
      this.edit = true;
      this.value = this.$props.task.name;
    },
    editTask(data, type) {
      const props = this.$props;
      this.$store.commit('tasks/editTask', { columnIndex: props.columnIndex, taskIndex: props.taskIndex, data, type });
      this.clearAll();
    },
    editTaskHandler(columnIndex, taskIndex) {
      this.$store.commit('tasks/editTask', { columnIndex, taskIndex, data: this.value, type: 'value' });
      this.clearAll();
    },
  },
  computed: {
    checkbox: {
      set(value) {
        this.editTask(value, 'status');
      },
      get() {
        return this.$props.task.done;
      },
    },
  },
};
</script>
<style lang="scss">
.task-card {
  .delTask-btn {
    opacity: 0;
    transition: all 0.2s ease;
    visibility: hidden;
  }
  &:hover {
    .delTask-btn {
      opacity: 1;
      visibility: visible;
    }
  }
  .task-input {
    .v-input__control {
      font-size: 14px;
    }
  }
  .task-handle {
    cursor: grab;
  }
  &.checked {
    .task-name {
      text-decoration: line-through;
      font-style: italic;
    }
  }

  &:first-child {
    margin-top: 0;
  }

  margin-top: 6px;
}
</style>
