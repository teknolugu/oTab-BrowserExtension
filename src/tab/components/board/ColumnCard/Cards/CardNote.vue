<template>
  <card-ui class="hover:shadow-md group relative overflow-visible" min-height="60px">
    <textarea-ui
      class="font-medium group w-full"
      v-model="tempTitle"
      @blur="updateNote"
      v-autofocus
      v-if="edit || !data.title"
      placeholder="Note title"
      max-height="120px"
    ></textarea-ui>
    <template v-else>
      <div @click="(edit = true), (tempTitle = data.title)" class="pr-2">
        <p class="text-base font-medium pr-2 text-overflow">{{ data.title }}</p>
        <p class="text-sm text-default-soft line-clamp text-xs">{{ data.content | stripHTML }}</p>
      </div>
    </template>
    <div class="-mr-3 top-0 flex flex-col group-hover:visible invisible right-0 absolute">
      <button-icon small icon="pen" class="bg-card shadow mb-1" @click="editNote"></button-icon>
      <button-icon @click="$emit('delete', data.id)" small icon="trash" color="red" class="text-red bg-card shadow"></button-icon>
    </div>
  </card-ui>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        title: '',
        content: '',
      }),
    },
    columnId: String,
  },
  data: () => ({
    edit: false,
    tempTitle: '',
  }),
  methods: {
    editNote() {
      this.$emit('edit', {
        type: 'note',
        id: this.data.id,
      });
    },
    updateNote() {
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
};
</script>
<style>
.textarea-edit {
  min-height: 40px;
  max-height: 70px;
  width: 100%;
  @apply border-b;
  @apply text-sm;
  @apply leading-tight;
}
</style>
