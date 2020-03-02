<template>
  <div class="h-full flex items-center justify-center">
    <div class="w-7/12">
      <input-ui class="input-first-board font-medium w-full" autofocus style="padding: 0" @keyup.enter.native="addBoard" v-model="boardTitle" placeholder="Board name"></input-ui>
      <p class="text-base text-default-soft mt-1">Press <b>Enter</b> to add board</p>
    </div>
    <button-ui @click="$modal.show('auth')" class="absolute top-0 right-0 mr-6 mt-6" type="outline">Login</button-ui>
  </div>
</template>
<script>
export default {
  data: () => ({
    boardTitle: '',
  }),
  methods: {
    addBoard() {
      this.$store.dispatch('boards/add', this.boardTitle).then(id => {
        this.$store.commit('ui/update', {
          key: 'activeBoard',
          value: id,
        });
        this.boardTitle = '';
      });
    },
  },
};
</script>
