export default {
  state: {
    items: {},
    activeBoard: '',
  },
  mutations: {
    setNotes(state, notes) {
      state.items[state.activeBoard] = notes;
    },
    delNote(state, noteId) {
      let index = state.items[state.activeBoard].findIndex(note => note.id === noteId);
      state.items[state.activeBoard].splice(index, 1);
    },
    saveNote(state, note) {
      let board = state.items[state.activeBoard];
      let noteIndex = board.findIndex(fNote => fNote.id === note.id);
      board[noteIndex] = note;
    },
    newNote(state, { note, getters }) {
      getters.list.unshift(note);
    },
    updateList(state, value) {
      state.items[state.activeBoard] = value;
    },
  },
  actions: {
    saveNote({ state, commit }, note) {
      commit('saveNote', note);
      commit('triggerSave', 'notes', { root: true });
    },
    createNewNote({ state, getters, commit }) {
      return new Promise((resolve, reject) => {
        let note = {
          title: '',
          content: '',
          tags: [],
          id: Math.random()
            .toString(36)
            .substring(2, 15),
        };
        if (getters.list.length === 0) {
          resolve({ isFirst: true, note });
        } else {
          resolve({ isFirst: false, note });
        }
        commit('newNote', { note, getters });
      });
    },
  },
  getters: {
    isEmpty: state => {
      return state.items[state.activeBoard].length === 0 ? true : false;
    },
    list: state => {
      return state.items[state.activeBoard];
    },
  },
};
