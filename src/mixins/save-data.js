import { mapState } from 'vuex';

export default {
  data: () => ({
    components: ['collections', 'notes', 'tasks'],
  }),
  methods: {
    saveData(key, data) {
      this.$browser.storage.sync.set({ [key]: data });
    },
  },
  computed: {
    ...mapState({
      collections: state => state.collections.items,
      notes: state => state.notes.items,
      tasks: state => state.tasks.items,
    }),
  },
  mounted() {
    this.components.forEach(item =>
      this.$watch(
        item,
        newData => {
          this.saveData(item, newData);
        },
        { deep: true }
      )
    );
  },
};
