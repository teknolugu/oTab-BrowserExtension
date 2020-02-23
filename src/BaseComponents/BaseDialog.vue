<template>
  <div>
    <modal name="delete" width="500px" @before-open="beforeOpenDialog">
      <div class="flex px-5 items-center border-b text-red bg-card" style="height: 80px;">
        <unicon name="trash" class="p-3 rounded-full bg-red-200" height="24" width="24"></unicon>
        <p class="text-lg ml-3 font-medium">{{ dialogParams.title }}</p>
      </div>
      <div class="bg-gray-200 py-8 px-6" style="height: 220px">
        <p class="text-lg text-center">
          Are you sure want to delete <b> {{ dialogParams.text }}</b
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
        <p class="text-lg font-medium mb-5">{{ dialogParams.title }}</p>
        <input-ui
          autofocus
          class="w-full text-base"
          v-model="promptText"
          @keyup.enter.native="dialogHandler"
          :max="dialogParams.max"
          :type="dialogParams.type === 'password' ? 'password' : 'text'"
          input-style="background"
          :placeholder="dialogParams.type === 'password' ? 'Password' : 'Board name'"
        ></input-ui>
        <div class="mt-8 flex justify-end">
          <button-ui style="width: 100px;" class="mr-3" type="text" @click="hideDialog">Cancel</button-ui>
          <button-ui color="danger" v-if="dialogParams.type === 'password'" @click="dialogHandler">Delete</button-ui>
          <button-ui v-else style="width: 100px;" @click="dialogHandler" :disabled="!promptText">Create</button-ui>
        </div>
      </div>
    </modal>
    <base-auth-modal></base-auth-modal>
    <v-dialog />
  </div>
</template>
<script>
import BaseAuthModal from './BaseAuthModal.vue';

export default {
  components: { BaseAuthModal },
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
<style>
.v--modal-box {
  @apply bg-card rounded-lg !important;
}
</style>
