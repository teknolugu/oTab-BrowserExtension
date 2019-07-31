export default {
  methods: {
    createNewBoard() {
      this.$prompt('Input Board Name', 'Create Board', {
        confirmButtonText: 'Create',
        cancelButtonText: 'cancel',
        inputPattern: /^(?!\s*$).+/,
        inputErrorMessage: 'Invalid Name',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm')
            this.$store
              .dispatch('createNewBoard', instance.inputValue)
              .then(() => {
                done();
              })
              .catch(message => {
                instance.message = message;
              });
          else done();
        },
      })
        .then(({ value }) => {
          this.$message({
            type: 'success',
            message: 'Success Create Board',
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
