<template>
  <div>
    <modal name="delete" width="500px" @before-open="beforeOpenDialog">
      <div class="flex px-5 items-center border-b" style="height: 80px;">
        <unicon name="trash" class="p-3 rounded-full text-red-500 bg-red-100" height="24" width="24"></unicon>
        <p class="text-lg text-red-400 ml-3 font-medium">{{ dialogParams.title }}</p>
      </div>
      <div class="bg-gray-200 flex items-center justify-center flex-col" style="height: 220px">
        <p class="text-lg">
          Are you sure want to delete <b> {{ dialogParams.text }}</b
          >?
        </p>
        <div class="mt-6 text-sm flex" style="width: 300px">
          <button @click="hideDialog" class="w-6/12 py-3 mr-3 border rounded transition-bg hover:bg-gray-300">
            No, thanks
          </button>
          <button @click="dialogHandler" class="w-6/12 py-3 mr-3 border rounded bg-red-500 text-white">
            Delete
          </button>
        </div>
      </div>
    </modal>
    <modal name="prompt" width="400px" height="200px" @before-open="beforeOpenDialog">
      <div class="p-5">
        <p class="text-lg font-medium mb-5">{{ dialogParams.title }}</p>
        <input-ui
          autofocus
          class="w-full text-base"
          v-model="promptText"
          @keyup.enter.native="dialogHandler"
          :max="dialogParams.max"
          input-style="background"
          placeholder="Board name"
        ></input-ui>
        <div class="mt-8 flex justify-end">
          <button-ui style="width: 100px;" button-style="text" @click="hideDialog" class="font-medium">Cancel</button-ui>
          <button-ui class="font-medium ml-3 text-white" style="width: 100px;" @click="dialogHandler" :disabled="!promptText">Create</button-ui>
        </div>
      </div>
    </modal>
    <v-dialog />
  </div>
</template>
<script>
export default {
  data: () => ({
    activeDialog: '',
    dialogParams: {
      title: 'Dialog',
      text: 'some text',
    },
    promptText: '',
  }),
  methods: {
    beforeOpenDialog({ params, name }) {
      this.activeDialog = name;
      this.dialogParams = params;
    },
    dialogHandler() {
      if (typeof this.dialogParams.handler === 'function') {
        this.dialogParams.handler(this.activeDialog === 'prompt' ? this.promptText : true);
      }
      this.promptText = '';
      this.dialogParams = {
        title: 'Dialog',
        text: 'some text',
      };
      this.hideDialog();
    },
    hideDialog() {
      this.$modal.hide(this.activeDialog);
    },
  },
};
</script>
