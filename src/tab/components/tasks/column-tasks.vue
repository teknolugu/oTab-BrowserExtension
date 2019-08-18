<template>
  <el-card class="tasks-column" :key="columnIndex">
    <div class="column-header" slot="header">
      <p class="column-title capitalize">{{ column.title }}</p>
      <div class="right column-utils">
        <el-button icon="el-icon-plus" @click="newTask(columnIndex)" class="more-icon" size="mini" circle></el-button>
        <popover-menu name="Column" @editTitle="editTitle" @addTag="addTag" @delete="deleteColumn" direction="bottom" :index="columnIndex" :items="column">
          <span class="column-popover-btn" slot="activator">
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
      <Draggable class="tasks-body" ghost-class="ghost-tasks" group="tasks" handle=".task-handler" v-model="column.tasks">
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
          <task-card :task="task" :taskIndex="taskIndex" :columnIndex="columnIndex"></task-card>
        </template>
      </Draggable>
    </el-scrollbar>
  </el-card>
</template>
<script>
import Draggable from 'vuedraggable';
import PopoverMenu from '../popover-menu.vue';
import TaskCard from './task-card.vue';
export default {
  components: { Draggable, TaskCard, PopoverMenu },
  props: {
    column: Object,
    columnIndex: Number,
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
      this.$store.commit('tasks/deleteItem', index);
    },
    addTag({ select, index }) {
      this.$store.dispatch('tasks/addTaskTag', { select: select, index: index });
    },
    newTask(columnIndex) {
      this.$store.commit('tasks/newTask', columnIndex);
    },
  },
};
</script>
