<template>
  <div class="flex" style="align-items: self-start">
    <card-ui width="280px">
      <div class="text-center">
        <unicon name="user" class="p-6 bg-gray-100 rounded-full" height="30" width="30"></unicon>
        <p class="font-medium text-base">{{ user.name }}</p>
        <p class="text-sm text-default-soft">{{ user.email }}</p>
      </div>
      <hr class="my-5" />
      <div class="text-sm py-3 px-2">
        <p class="inline-block" :class="{ 'text-red': !user.emailVerified }">{{ user.emailVerified ? 'Email verified' : 'Email not verified' }}</p>
        <unicon name="check" v-show="user.emailVerified" class="text-green align-middle float-right"></unicon>
      </div>
      <div class="text-sm py-3 px-2">
        <p class="inline-block">Last login</p>
        <p class="font-medium float-right inline-block">{{ getDate(user.lastLogin) }}</p>
      </div>
      <div class="text-sm py-3 px-2">
        <p class="inline-block">Joined at</p>
        <p class="font-medium float-right inline-block">{{ getDate(user.createdAt) }}</p>
      </div>
    </card-ui>
    <card-ui class="flex-grow ml-5">
      <p class="text-lg mb-3 font-medium">Profile</p>
      <list-ui icon="user">
        <input-ui
          v-if="editName"
          input-style="transparent"
          placeholder="Name"
          class="ml-2"
          block
          @blur="updateName"
          @keyup.enter.native="updateName"
          v-model="tempName"
          autofocus
        ></input-ui>
        <p class="ml-4" v-else>{{ user.name }}</p>
        <button-icon icon="pen" slot="suffix" v-show="!editName" @click="(editName = true), (tempName = user.name)" small></button-icon>
      </list-ui>
      <list-ui icon="envelope-alt">
        <p class="ml-4">{{ user.email }}</p>
      </list-ui>
      <list-ui icon="key-skeleton">
        <p class="ml-4">Change password</p>
        <button-icon icon="pen" slot="suffix" small></button-icon>
      </list-ui>
      <list-ui icon="user-minus">
        <p class="ml-4">Delete account</p>
        <button-ui color="danger" slot="suffix" size="small" @click="deleteAccount">Delete</button-ui>
      </list-ui>
      <template v-if="!user.emailVerified">
        <list-ui icon="envelope-exclamation">
          <p class="ml-4">Verify your email</p>
          <template slot="suffix">
            <button-ui size="small" class="mr-3" @click="reloadCurrentUser">I've verified my email</button-ui>
            <button-ui type="outline" size="small" @click="resendVerifyEmail">Resend verify email</button-ui>
          </template>
        </list-ui>
      </template>
    </card-ui>
  </div>
</template>
<script>
import dayjs from 'dayjs';

export default {
  data: () => ({
    tempName: '',
    editName: false,
  }),
  methods: {
    updateName() {
      if (this.tempName === this.user.name) return (this.editName = false);

      this.$sendMessage('updateName', {
        name: this.tempName,
      });
      this.$store.commit('user/update', {
        key: 'name',
        value: this.tempName,
      });
      this.editName = false;
    },
    deleteAccount() {
      this.$modal.show('delete', {
        title: 'Delete account',
        text: 'your account',
        handler: confirm => {
          if (confirm) {
            setTimeout(() => {
              this.$modal.show('prompt', {
                title: 'Enter password',
                type: 'password',
                handler: password => {
                  this.$sendMessage('deleteAccount', { password })
                    .then(() => {
                      this.$store.commit('user/toDefault');
                      this.$store.commit('ui/update', {
                        key: 'activeHomePage',
                        value: 'board-list',
                      });
                    })
                    .catch(err => {
                      this.$toast.error('Invalid password');
                    });
                },
              });
            }, 500);
          }
        },
      });
    },
    reloadCurrentUser() {
      this.$sendMessage('reloadCurrentUser').then(() => window.location.reload());
    },
    resendVerifyEmail() {
      this.$sendMessage('resendVerifyEmail').then(() => this.$toast('Check your email inbox'));
    },
    getDate(date) {
      return typeof date === 'string' ? date.slice(0, 16) : dayjs(date).format('ddd, DD MMM YYYY');
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>
