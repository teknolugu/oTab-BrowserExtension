<template>
  <div class="tasks-container fill-height pt-3">
    <div class="scroller"></div>
    <empty-item :icon="$icons.mdiCalendarCheckOutline" title="There's nothing here" v-if="lists.length === 0"></empty-item>
    <Draggable class="tasks-container--wrapper" v-model="lists" handle=".column-header" v-else>
      <template v-for="(column, columnIndex) in lists">
        <column-tasks :column="column" :columnIndex="columnIndex" v-show="tagFilter(column)"></column-tasks>
      </template>
    </Draggable>
  </div>
</template>
<script>
import Draggable from 'vuedraggable';
import FilterItem from '../../mixins/filter-item';
import EmptyItem from '../components/empty-item';
import ColumnTasks from '../components/tasks/column-tasks';

export default {
  mixins: [FilterItem],
  components: { Draggable, ColumnTasks, EmptyItem },
  computed: {
    lists: {
      get() {
        return this.$store.getters['tasks/list'];
      },
      set(value) {
        this.$store.commit('tasks/changeColumn', value);
      },
    },
  },
};
</script>
<style lang="scss">
.tasks-container {
  position: absolute;
  width: 100%;
  overflow-y: all;
  height: 100%;
  &--wrapper {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    .task-column {
      flex: 0 0 auto;
      margin: 0 10px;
    }
  }
}
</style>
