<template>
  <card-ui class="absolute mt-8 w-full h-full left-0 top-0" style="z-index: 1">
    <template slot="header">
      <button-icon icon="arrow-left" size="24" @click="close"></button-icon>
      <p class="text-base font-medium ml-1">Edit task</p>
      <div class="flex-grow"></div>
      <button-icon icon="trash" color="red" @click="deleteTask" class="text-red"></button-icon>
    </template>
    <div class="bg-gray-200 my-2" style="height: 1px"></div>
    <div class="mt-4">
      <input-ui input-style="background" placeholder="Task title" class="w-full" v-model="title"></input-ui>
      <textarea-ui class="w-full mt-3" input-style="background" min-height="130px" v-model="content" max-height="200px" placeholder="Task description"></textarea-ui>
    </div>
  </card-ui>
</template>
<script>
export default {
  props: {
    id: String,
    columnId: String,
  },
  data: () => ({
    title: '',
    content: '',
  }),
  computed: {
    item() {
      return this.$store.getters['items/getItemById'](this.columnId, this.id);
    },
  },
  methods: {
    deleteTask() {
      this.$store.dispatch('items/delete', { columnId: this.columnId, id: this.id });
      this.$emit('close');
    },
    close() {
      this.$store.dispatch('items/update', {
        id: this.id,
        columnId: this.columnId,
        data: {
          title: this.title,
          content: this.content,
        },
      });
      this.$emit('close');
    },
  },
  mounted() {
    this.title = this.item.title;
    this.content = this.item.content;
  },
};
</script>
