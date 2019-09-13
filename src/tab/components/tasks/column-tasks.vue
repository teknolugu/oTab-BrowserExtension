<template>
  <v-card height="100%" width="340px" class="task-column mb-2">
    <v-card-title class="pb-1 pt-3 d-inline-block column-header">
      <div class="d-flex align-center justify-space-between">
        <p class="subtitle-1 font-weight-medium text-truncate capitalize ma-0" style="max-width: 85%">{{ column.title }}</p>
        <div>
          <v-btn icon color="primary" @click="newTask(columnIndex)">
            <v-icon>{{ $icons.mdiPlus }}</v-icon>
          </v-btn>
          <popover-menu @editTitle="editTitle" @addTag="addTag" @delete="deleteColumn" name="column" :index="columnIndex" :items="column"></popover-menu>
        </div>
      </div>
    </v-card-title>
    <v-divider class="mx-4" style="border-style: dashed;"></v-divider>
    <v-card-text class="pb-0 pt-3">
      <template v-for="(tag, tagIndex) in column.tags">
        <v-chip label small dark class="collection-tag note-card-tag" :color="tag.color" @click="activeTag(tag.id)" v-if="tagIndex <= 2">
          <span class="capitalize">{{ tag.name }}</span>
        </v-chip>
        <v-chip small class="note-card-tag" label v-if="tagIndex === 3"> +{{ column.tags.length - 3 }} </v-chip>
      </template>
    </v-card-text>
    <v-card color="background" width="95%" min-height="250px" flat class="my-3 scroller tasks-content-container mx-auto">
      <v-card-title class="grey--text px-3 py-2 justify-space-between">
        <span class="text-uppercase caption font-weight-medium">tasks</span>
        <div class="tasks-status caption">
          <span class="mr-1"
            ><span class="font-weight-medium">{{ column.tasks.length }}</span> Tasks</span
          >
          <span
            ><span class="font-weight-medium">{{ getCompleted }}</span> Completed</span
          >
        </div>
      </v-card-title>
      <v-card-text class="px-3">
        <Draggable class="draggable-task" ghost-class="ghost-tasks" group="tasks" handle=".task-handle" v-model="changeTasks">
          <template v-for="(task, taskIndex) in searchFilter(column.tasks, 'name', 'name')">
            <task-card :task="task" :taskIndex="taskIndex" :columnIndex="columnIndex"></task-card>
          </template>
        </Draggable>
      </v-card-text>
    </v-card>
  </v-card>
</template>
<script>
import Draggable from 'vuedraggable';
import PopoverMenu from '../popover-menu.vue';
import TaskCard from './task-card.vue';
import FilterItem from '../../../mixins/filter-item';

export default {
  mixins: [FilterItem],
  components: { Draggable, TaskCard, PopoverMenu },
  props: {
    column: {
      type: Object,
      required: true,
      default: () => ({
        tags: [],
        tasks: [],
        title: '',
      }),
    },
    columnIndex: Number,
  },
  computed: {
    getCompleted() {
      return this.$props.column.tasks.filter(task => task.done).length;
    },
    changeTasks: {
      get() {
        return this.$props.column.tasks;
      },
      set(value) {
        this.$store.commit('tasks/changeTask', { index: this.$props.columnIndex, data: value });
      },
    },
  },
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
      this.$store.commit('tasks/deleteColumn', index);
    },
    addTag({ tag, index }) {
      this.$store.commit('tasks/addTag', { tag, index });
    },
    newTask(columnIndex) {
      this.$store.commit('tasks/newTask', columnIndex);
    },
  },
};
</script>
<style lang="scss">
.tasks-content-container {
  max-height: 500px;
  overflow-y: auto;
}
.draggable-task {
  min-height: 250px;
}
.column-header {
  cursor: grab;
  width: 100%;
}
</style>
