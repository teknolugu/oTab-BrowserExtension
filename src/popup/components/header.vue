<template>
  <v-app-bar height="130px" class="header" dark color="primary" flat extended>
    <v-row class="align-center">
      <v-col cols="2" class="pr-0">
        <span class="title font-weight-regular mr-n1">o</span>
        <span class="title font-weight-bold">Tab</span>
      </v-col>
      <v-col cols="10">
        <v-select
          class="select-board"
          flat
          solo
          hide-details
          :items="$store.getters.boardList"
          item-text="title"
          item-value="id"
          :value="board.id"
          @change="activeBoardChange"
          return-object
        ></v-select>
      </v-col>
    </v-row>
  </v-app-bar>
</template>
<script>
import Bus from '../bus';

export default {
  props: {
    board: {
      type: Object,
      default: () => ({
        id: '',
      }),
    },
  },
  methods: {
    activeBoardChange(boardId) {
      this.$store.commit('activeBoard', boardId);
      Bus.$emit('changeBoard');
    },
  },
};
</script>
<style lang="scss">
.header {
  .v-toolbar__content {
    align-items: start !important;
  }
}

.select-board {
  .v-input__control {
    min-height: 0 !important;
    .v-input__slot {
      background: #3d96f2 !important;
      border: 1px solid #3a8ce0;
      height: 40px;
    }
  }
}

.header-button {
  background-color: #3f99f7 !important;
  border: 1px solid #3a8ce0 !important;
}
</style>
