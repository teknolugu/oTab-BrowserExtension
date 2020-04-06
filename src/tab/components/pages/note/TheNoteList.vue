<template>
  <scrollbar class="h-full px-5 scrollbar">
    <div class="add-note hover:bg-gray-300" @click="addNote">
      <unicon name="file-plus" height="22" width="22" class="align-top"></unicon>
      <p class="font-medium text-base inline-block ml-1">Add note</p>
    </div>
    <div class="mt-5">
      <card-ui
        hover
        v-for="note in notes"
        :key="note.id"
        class="mb-4 first:mt-0 relative"
        @click="changeActiveNote(note.id)"
        :class="{ 'border border-blue-500 shadow-xl': isActiveNote(note.id) }"
      >
        <div class="group cursor-pointer" style="min-height: 50px" @click="changeActiveNote(note.id)">
          <p class="text-base font-medium text-overflow group-hover:text-primary mb-1 duration-100 ease-in-out transition-colors">{{ note.title }}</p>
          <p class="line-clamp text-sm">{{ note.content | stripHTML }}</p>
        </div>
        <div class="mt-2">
          <span class="text-default-soft py-2 inline-block">{{ getContentLength(note.content) }} words</span>
          <button-icon icon="trash" class="float-right text-red" @click="deleteNote" color="red"></button-icon>
        </div>
      </card-ui>
    </div>
  </scrollbar>
</template>
<script>
import scrollbar from 'vue-perfect-scrollbar';

export default {
  components: { scrollbar },
  data: () => ({
    columnId: '',
    itemId: '',
  }),
  computed: {
    notes() {
      return this.$store.getters['items/getItemsByColumnId'](this.columnId).filter(item => item.type === 'note');
    },
  },
  methods: {
    setIds() {
      const { 0: columnId, 1: itemId } = this.$route.params.id.split('&');

      this.columnId = columnId;
      this.itemId = itemId;
    },
    getContentLength(content) {
      return content.split(' ').length;
    },
    addNote() {
      this.$store.commit('items/addItem', {
        columnId: this.columnId,
        data: {
          title: '',
          content: '',
          type: 'note',
        },
      });
    },
    deleteNote() {
      this.$store
        .dispatch('items/delete', {
          id: this.itemId,
          columnId: this.columnId,
        })
        .then(() => {
          const activeItemId = this.$route.params.id.split('&')[1];
          if (activeItemId === this.itemId) {
            if (this.notes.length === 0) this.$router.push('/board');
            else this.$router.push(`/note/${this.columnId}&${this.notes[0].id}`);
          }
        });
    },
    changeActiveNote(noteId) {
      this.$router.push(`/note/${this.columnId}&${noteId}`);
    },
    isActiveNote(noteId) {
      const { 1: id } = this.$route.params.id.split('&');
      return noteId === id;
    },
  },
  watch: {
    '$route.params': function() {
      this.setIds();
    },
  },
  created() {
    this.setIds();
  },
};
</script>
<style scoped>
.add-note {
  @apply text-default-soft rounded-lg py-1 px-2 cursor-pointer inline-block transition-colors duration-100 ease-in-out;
}
</style>
