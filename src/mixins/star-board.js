export default {
  methods: {
    staredBoard(boardId) {
      this.$browser.storage.sync.get('starBoard').then(data => {
        let boardData = boardId === data.starBoard ? '' : boardId;
        this.$store.commit('starBoard', boardData);
        this.$browser.storage.local.set({ starBoard: boardData });
      });
    },
  },
};
