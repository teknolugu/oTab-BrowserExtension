export default {
  state: {
    items: {},
    activeBoard: '',
  },
  mutations: {
    delTag(state, { tagId, columnIndex }) {
      const board = state.items[state.activeBoard];
      const tagIndex = board[columnIndex].tags.findIndex(tag => tag.id === tagId);
      board[columnIndex].tags.splice(tagIndex, 1);
    },
    changeTask(state, { index, data }) {
      state.items[state.activeBoard][index].tasks = data;
    },
    changeColumn(state, data) {
      state.items[state.activeBoard] = data;
    },
    newTask(state, columnIndex) {
      state.items[state.activeBoard][columnIndex].tasks.push({
        name: '',
        done: false,
      });
    },
    addTag(state, { tag, index }) {
      const board = state.items[state.activeBoard][index].tags.push(tag);
    },
    editTitle(state, { title, index }) {
      state.items[state.activeBoard][index].title = title;
    },
    delTask(state, { columnIndex, taskIndex }) {
      state.items[state.activeBoard][columnIndex].tasks.splice(taskIndex, 1);
    },
    createColumn(state, { title }) {
      state.items[state.activeBoard].push({
        title,
        tasks: [],
        tags: [],
      });
    },
    deleteColumn(state, index) {
      state.items[state.activeBoard].splice(index, 1);
    },
    editTask(state, { columnIndex, taskIndex, data, type }) {
      const task = state.items[state.activeBoard][columnIndex].tasks[taskIndex];
      type === 'value' ? (task.name = data) : (task.done = data);
    },
  },
  getters: {
    list: state => {
      return state.items[state.activeBoard];
    },
  },
};
