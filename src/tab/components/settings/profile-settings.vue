<template>
  <v-container class="py-0">
    <v-subheader class="pl-0">Profile</v-subheader>
    <v-card>
      <v-list dense class="py-0">
        <v-list-item>
          <v-list-item-content>
            <div class="d-flex align-center" v-if="editMode">
              <v-text-field autofocus maxlength="20" class="mt-0 pt-0" hide-details v-model="newName"></v-text-field>
              <v-btn class="ml-2" small text @click="editMode = false">Cancel</v-btn>
              <v-btn class="ml-2" color="primary" small depressed @click="editName">Done</v-btn>
            </div>
            <template v-else>
              <v-list-item-title>{{ $store.state.user.name }}</v-list-item-title>
              <v-list-item-subtitle>Name</v-list-item-subtitle>
            </template>
          </v-list-item-content>
          <v-list-item-action v-show="!editMode">
            <v-btn icon @click="(editMode = true), (newName = $store.state.user.name)">
              <v-icon>{{ $icons.mdiPencil }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ $store.state.user.email }}</v-list-item-title>
            <v-list-item-subtitle>Email</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Change Password</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="sendPasswordEmail">
              <v-icon>{{ $icons.mdiPencil }}</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
    <v-subheader class="pl-0">Account</v-subheader>
    <v-card>
      <v-list dense class="py-0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Last Login</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <span>{{ $store.state.user.lastLogin | formatDate }}</span>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Created At</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <span>{{ $store.state.user.createdAt | formatDate }}</span>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <div v-if="deleteMode" class="d-flex flex-row align-center">
              <v-text-field
                class="pt-0 mt-0"
                autofocus
                :append-icon="showPassword ? $icons.mdiEye : $icons.mdiEyeOff"
                @click:append="showPassword = !showPassword"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Type your password"
                hide-details
              ></v-text-field>
              <v-btn text @click="deleteMode = false" small class="ml-3">Cancel</v-btn>
            </div>
            <v-list-item-title v-else>Delete Account</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn color="error" depressed small @click="deleteMode = true" v-if="!deleteMode">Delete</v-btn>
            <v-btn color="error" depressed small @click="deleteAccount" v-else>Delete</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    newName: '',
    deleteMode: false,
    editMode: false,
    showPassword: false,
    password: '',
  }),
  methods: {
    editName() {
      if (!!this.newName || this.newName === this.$store.state.user.name) {
        this.sendMessage('updateName', { name: this.newName });
        this.$store.commit('changeUser', { ...this.$store.state.user.name, name: this.newName });
        this.editMode = false;
      }
    },
    sendPasswordEmail() {
      this.sendMessage('sendPasswordResetEmail', { email: this.$store.state.user.email })
        .then(() => {
          this.$dialog.notify.success('Check your email inbox');
        })
        .catch(err => this.$dialog.notify.error(err));
    },
    async deleteAccount() {
      const confirm = await this.$dialog.confirm({ title: 'Warning', text: 'Are you sure want to delete this account?' });
      if (confirm) {
        this.sendMessage('deleteAccount', { password: this.password })
          .then(() => {
            this.$store.commit('changeUser', { name: 'Guest', email: '', emailVerified: false });
            this.$store.commit('changeBoolean', { key: 'isLogin', data: false });
            this.$emit('change', 0);
          })
          .catch(err => {
            this.$dialog.notify.error('The password is invalid');
          });
        this.deleteMode = false;
      }
    },
  },
  filters: {
    formatDate(date) {
      if (date) return date.slice(0, 16);
    },
  },
};
</script>
