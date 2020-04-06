<template>
  <div>
    <modal name="delete" width="500px" @before-open="beforeOpenDialog">
      <div class="flex px-5 items-center border-b text-red bg-card" style="height: 80px;">
        <unicon name="trash" class="p-3 rounded-full bg-red-200" height="24" width="24"></unicon>
        <p class="text-lg ml-3 font-medium">{{ params.title }}</p>
      </div>
      <div class="bg-gray-200 py-8 px-6 flex justify-center flex-col" style="height: 220px">
        <p class="text-lg text-center">
          Are you sure want to delete <b> {{ params.text }}</b
          >?
        </p>
        <div class="mt-8 text-sm px-12 flex">
          <button-ui @click="hideDialog" class="w-6/12 py-3 mr-3 hover:bg-gray-300" type="outline">
            No, thanks
          </button-ui>
          <button-ui @click="dialogHandler" class="w-6/12 py-3" color="danger">
            Delete
          </button-ui>
        </div>
      </div>
    </modal>
    <modal name="prompt" width="400px" height="200px" @before-open="beforeOpenDialog">
      <div class="p-5">
        <p class="text-lg font-medium mb-5">{{ params.title }}</p>
        <input-ui
          autofocus
          class="w-full text-base"
          v-model="promptText"
          @keyup.enter.native="dialogHandler"
          :max="params.max"
          :type="params.type"
          input-style="background"
          :placeholder="params.placeholder"
        ></input-ui>
        <div class="mt-8 flex justify-end">
          <button-ui style="width: 100px;" type="text" class="mr-3" @click="hideDialog">Cancel</button-ui>
          <button-ui style="min-width: 100px;" :color="params.button.color" @click="dialogHandler" :disabled="!promptText">{{ params.button.text }}</button-ui>
        </div>
      </div>
    </modal>
    <auth-modal></auth-modal>
    <v-dialog />
  </div>
</template>
<script>
import AuthModal from './BaseAuthModal.vue';

export default {
  components: { AuthModal },
  data: () => ({
    activeDialog: '',
    params: {
      title: 'Dialog',
      text: 'some text',
      type: 'text',
      button: {
        color: 'primary',
        text: 'Create board',
      },
    },
    promptText: '',
  }),
  methods: {
    beforeOpenDialog({ params, name }) {
      this.activeDialog = name;
      this.params = params;
    },
    dialogHandler() {
      if (typeof this.params.handler === 'function') {
        this.params.handler(this.activeDialog === 'prompt' ? this.promptText : true);
      }
      this.promptText = '';
      this.params = {
        title: 'Dialog',
        text: 'some text',
      };
      this.hideDialog();
    },
    hideDialog() {
      this.promptText = '';
      this.$modal.hide(this.activeDialog);
    },
  },
};
</script>
<style>
.v--modal-box {
  @apply bg-card rounded-lg !important;
}
</style>
