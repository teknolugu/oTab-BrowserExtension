<template>
  <card-ui class="group hover:shadow-md relative overflow-visible">
    <div class="flex flex-row">
      <div class="mr-3" :title="data.done ? '' : 'Mark as complete'">
        <checkbox-ui v-model="done" class="mt-1"></checkbox-ui>
      </div>
      <input-ui v-if="edit || !data.title" @blur="updateTask" autofocus class="w-full" style="padding: 0" v-model="tempTitle"></input-ui>
      <div class="w-11/12" v-else @click="(edit = true), (tempTitle = data.title)">
        <p :class="{ 'line-through italic': data.done }" class="text-base mt-1 flex-grow text-overflow leading-tight">{{ data.title }}</p>
        <p class="leading-snug text-xs text-gray-600 line-clamp">{{ data.content }}</p>
      </div>
    </div>
    <div v-if="!edit" class="-mr-3 top-0 flex flex-col group-hover:visible invisible right-0 absolute">
      <button-icon small icon="pen" class="bg-white shadow mb-1" @click="$emit('edit', data.id)"></button-icon>
      <button-icon small icon="trash" color="red" class="text-red-500 bg-white shadow" @click="$emit('delete', data.id)"></button-icon>
    </div>
  </card-ui>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        title: 'lorem',
        done: false,
      }),
    },
    columnId: {
      type: String,
    },
  },
  data: () => ({
    edit: false,
    tempTitle: '',
  }),
  methods: {
    updateTask() {
      this.$emit('update', {
        id: this.data.id,
        data: {
          title: this.tempTitle,
        },
      });
      this.tempTitle = '';
      this.edit = false;
    },
  },
  computed: {
    done: {
      get() {
        return this.data.done;
      },
      set(value) {
        this.$emit('update', {
          id: this.data.id,
          data: {
            done: value,
          },
        });
      },
    },
  },
};
</script>
