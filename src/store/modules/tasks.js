export default {
  state: {
    items: {},
    activeBoard: '',
  },
  mutations: {
    delTag(state, { tagId, columnIndex }) {
      let board = state.items[state.activeBoard];
      let tagIndex = board[columnIndex].tags.findIndex(tag => tag.id === tagId);
      board[columnIndex].tags.splice(tagIndex, 1);
    },
    newTask(state, columnIndex) {
      state.items[state.activeBoard][columnIndex].tasks.push({
        name: '',
        done: false,
      });
    },
    addTag(state, { allTags, select, index }) {
      let board = state.items[state.activeBoard];
      for (let id of select) {
        let tagIndex = allTags.findIndex(item => item.id === id);
        if (tagIndex !== -1) board[index].tags.push(allTags[tagIndex]);
      }
    },
    editTitle(state, { title, index }) {
      state.items[state.activeBoard][index].title = title;
    },
    delTask(state, { columnIndex, taskIndex }) {
      state.items[state.activeBoard][columnIndex].tasks.splice(taskIndex, 1);
    },
    createItem(state, {title}) {
      state.items[state.activeBoard].push({
        title: title,
        tasks: [],
        tags: [],
      });
    },
    deleteItem(state, index) {
      state.items[state.activeBoard].splice(index, 1);
    },
    editTask(state, { columnIndex, taskIndex, data, type }) {
      let task = state.items[state.activeBoard][columnIndex].tasks[taskIndex];
      type === 'value' ? (task.name = data) : (task.done = data);
    },
  },
  actions: {
    addTaskTag({ rooState, commit, rootGetters }, { select, index }) {
      let allTags = rootGetters.board.allTags;
      commit('addTag', { allTags, select, index });
    },
  },
  getters: {
    list: state => {
      return state.items[state.activeBoard];
    },
  },
};
