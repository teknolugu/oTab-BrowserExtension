<template>
  <div class="list-card relative overflow-hidden">
    <column-header :title="column.title" :labels="column.labels" :items="items" :columnId="column.id"></column-header>
    <column-tag :labels="column.labels"></column-tag>
    <div class="bg-gray-200 rounded">
      <div class="px-3 py-2">
        <button-ui small button-style="outline" class="hover:bg-gray-300" @click="addItem('note')" style="padding: 5px 6px 0px 6px">
          <unicon name="notes" height="20" width="20"></unicon>
          <p class="inline-block align-super text-xs font-medium">Add note</p>
        </button-ui>
        <button-ui small button-style="outline" class="hover:bg-gray-300 ml-2" @click="addItem('task')" style="padding: 5px 6px 0px 6px">
          <unicon name="clipboard-notes" height="20" width="20"></unicon>
          <p class="inline-block align-super text-xs font-medium">Add task</p>
        </button-ui>
      </div>
      <draggable v-model="items" class="content scrollbar overflow-y-auto relative px-3 pb-4" group="list" ghost-class="hidden-child">
        <template v-for="item in filteredItems">
          <component class="mt-3 first:mt-0" :is="item.type" @update="updateItem" @delete="deleteItem" @edit="activateEditTask" showUtil :data="item"></component>
        </template>
      </draggable>
    </div>
    <transition name="slide" enter-active-class="slideInLeft" leave-active-class="slideOutLeft">
      <card-edit-task :columnId="column.id" :id="editTask.id" style="animation-duration: 0.5s" @close="editTask.active = false" v-if="editTask.active"></card-edit-task>
    </transition>
  </div>
</template>
<script>
import draggable from 'vuedraggable';

import task from './cards/CardTask.vue';
import note from './cards/CardNote.vue';
import tab from './cards/CardTab.vue';
import CardEditTask from './cards/CardEditTask.vue';
import ColumnHeader from './ColumnHeader.vue';
import ColumnTag from './ColumnTag.vue';

export default {
  components: { task, note, tab, CardEditTask, draggable, ColumnHeader, ColumnTag },
  props: {
    column: {
      type: Object,
      default: () => ({
        title: '',
        id: '',
        labels: [],
      }),
    },
  },
  data: () => ({
    showLabel: false,
    editTask: {
      active: false,
      id: '',
    },
  }),
  methods: {
    activateEditTask(id) {
      this.editTask = {
        active: true,
        id,
      };
    },
    addItem(type) {
      this.$store.commit('item/addItem', {
        columnId: this.column.id,
        data: {
          type: type.toLowerCase(),
          title: '',
          content: '',
          done: type === 'task' ? false : undefined,
        },
      });
    },
    updateItem({ id, data }) {
      this.$store.dispatch('item/update', {
        columnId: this.column.id,
        id,
        data,
      });
    },
    deleteItem(id) {
      this.$store.dispatch('item/delete', {
        columnId: this.column.id,
        id,
      });
    },
  },
  computed: {
    items: {
      get() {
        return this.$store.getters['item/getItemsByColumnId'](this.column.id);
      },
      set(items) {
        this.$store.commit('changeItems', { columnId: this.column.id, items });
      },
    },
    filteredItems() {
      const { search } = this.$store.state;

      return this.$store.getters['item/getItemsByColumnId'](this.column.id).filter(item => {
        if (search.type === 'column') return item;

        if (search.type === item.type) return item.title.toLowerCase().match(search.query);
      });
    },
  },
};
</script>
<style>
.list-card {
  width: 300px;
}
.list-card .content {
  width: 100%;
  min-height: 300px;
  max-height: calc(100vh - 15.5rem);
}
</style>
