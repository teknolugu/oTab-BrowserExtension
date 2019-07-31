export default {
  methods: {
    inputValidator(input) {
      if (input && input.length > 25) {
        return 'input has to be 25 length';
      } else return true;
    },
    createItem(commitName) {
      this.$prompt('Input Item Name', 'Create Item', {
        confirmButtonText: 'Create',
        cancelButtonText: 'cancel',
        inputPattern: /^(?!\s*$).+/,
        inputValidator: this.inputValidator,
        inputErrorMessage: 'Invalid Name',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') this.$store.commit(commitName, {title: instance.inputValue});
          done();
        },
      })
        .then(({ value }) => {
          this.$message({
            type: 'success',
            message: 'Success Create Item',
          });
        })
        .catch(() => {
          this.$message({
            type: 'message',
            message: 'Create canceled',
          });
        });
    },
  },
};
