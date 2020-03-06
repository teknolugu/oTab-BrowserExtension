export default {
  data: () => ({
    tagsColors: {
      index: 0,
      colors: ['#409EFF', '#EC407A', '#FFA726', '#66BB6A', '#FFEE58', '#EF5350', '#AB47BC'],
    },
  }),
  methods: {
    changeColor() {
      this.tagsColors.index >= this.tagsColors.colors.length - 1 ? (this.tagsColors.index = 0) : (this.tagsColors.index += 1);
    },
    createTag() {
      const newTag = {
        name: this.inputValue,
        color: this.tagsColors.colors[this.tagsColors.index],
      };
      this.$store
        .dispatch('createNewTag', newTag)
        .then(() => (this.inputValue = ''))
        .catch(message => {
          alert(message);
        });
    },
  },
};
