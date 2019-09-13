<template>
  <v-dialog v-model="visible" width="800" height="500" class="overflow-hidden" persistent>
    <v-card width="800" height="500" class="overflow-hidden">
      <v-row class="fill-height">
        <v-col cols="5" class="primary white--text">
          <v-container fill-height class="align-center px-5">
            <div>
              <p class="headline white--text mb-1">
                <span class="mr-n2">o</span>
                <span class="font-weight-bold">Tab</span>
              </p>
              <p class="body-1 mb-0">{{ text.text1 }}</p>
              <v-divider dark class="my-4"></v-divider>
              <div class="ml-1">
                <p class="mb-2 body-2">{{ text.text2 }}</p>
                <v-btn outlined class="px-4" color="white" :disabled="loading" @click="loginSection = !loginSection" small>{{ text.text3 }}</v-btn>
              </div>
            </div>
            <p class="white--text" style="position: absolute; bottom: 0;">Hello There 😊</p>
          </v-container>
        </v-col>
        <v-col class="pr-6" cols="7" style="position: relative;">
          <v-container class="fill-height align-center">
            <v-icon class="grey--text close-auth" @click="visible = false">{{ $icons.mdiClose }}</v-icon>
            <v-btn icon @click="tab = 0" v-show="tab === 2" absolute top left>
              <v-icon>{{ $icons.mdiChevronLeft }}</v-icon>
            </v-btn>
            <v-tabs-items style="width: 100%" v-model="tab">
              <v-tab-item>
                <v-form v-model="isValid">
                  <v-slide-y-transition mode="out-in">
                    <v-text-field
                      counter="20"
                      v-model="userInfo.name"
                      :rules="[!loginSection ? rules.required : true, rules.counter]"
                      outlined
                      class="mt-1"
                      label="Name"
                      v-show="!loginSection"
                    ></v-text-field>
                  </v-slide-y-transition>
                  <v-text-field v-model="userInfo.email" :rules="[rules.required, rules.email]" outlined class="mt-1" label="Email"></v-text-field>
                  <v-text-field
                    v-model="userInfo.password"
                    :rules="[rules.required, !loginSection ? rules.minPassword : true]"
                    outlined
                    class="mt-1"
                    label="Password"
                    :append-icon="showPassword ? $icons.mdiEye : $icons.mdiEyeOff"
                    @click:append="showPassword = !showPassword"
                    :type="showPassword ? 'text' : 'password'"
                  ></v-text-field>
                </v-form>
                <p class="primary--text font-weight-medium text-right" style="cursor: pointer;" @click="tab = 2" v-show="loginSection">Forgot your password?</p>
                <v-btn :loading="loading" :disabled="!isValid" block color="primary" depressed class="mt-2" @click="actionButton">{{ text.text4 }}</v-btn>
                <!-- <p class="grey--text my-2 text-center font-weight-medium">Or {{text.text4}} using</p>
	                            <div>
	                                <v-btn depressed class="capitalize mx-auto" dark color="#4285F4">
	                                	<v-icon left>mdi-google</v-icon>
	                                	Google
	                                </v-btn>
	                            </div> -->
              </v-tab-item>
              <v-tab-item>
                <empty-item :icon="$icons.mdiEmail">
                  <p class="text-center mb-0 subtitle-1 font-weight-medium">You need to verify you Email</p>
                  <p class="text-center body-2">Check your email inbox</p>
                  <p class="primary--text captions text-center" style="cursor: pointer;" @click="resendEmail">Resend the verification email</p>
                </empty-item>
              </v-tab-item>
              <v-tab-item>
                <v-text-field outlined label="Email" :rules="[rules.required, rules.email]" v-model="resetPassEmail"></v-text-field>
                <v-btn color="primary" block depressed :disabled="loading" class="mt-2" @click="forgotPassword">Send Reset Email</v-btn>
              </v-tab-item>
            </v-tabs-items>
          </v-container>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
import EmptyItem from './empty-item';
import Bus from '../utils/bus';

export default {
  components: { EmptyItem },
  data: () => ({
    loading: false,
    visible: false,
    isValid: false,
    loginSection: true,
    resetPassEmail: '',
    userInfo: {
      name: '',
      email: '',
      password: '',
    },
    showPassword: false,
    tab: 0,
    rules: {
      minPassword: value => value.length >= 8 || 'Password min 8 characters',
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      },
    },
  }),
  methods: {
    forgotPassword() {
      if (typeof this.rules.email(this.resetPassEmail) === 'boolean' && typeof this.rules.required(this.resetPassEmail) === 'boolean') {
        this.sendMessage('sendPasswordResetEmail', { email: this.resetPassEmail }).then(() => this.$dialog.notify.success('Check your email inbox'));
      } else {
        this.$dialog.notify.error('Invalid Email');
      }
    },
    resendEmail() {
      this.sendMessage('resendVerifyEmail');
      this.$dialog.notify.success('Send Verification Email');
    },
    actionButton() {
      const type = this.loginSection ? 'login' : 'signUp';
      this.loading = true;
      this.sendMessage(type, this.userInfo)
        .then(async user => {
          this.loading = false;
          this.$store.commit('changeUser', { ...user });
          this.$store.commit('changeBoolean', { key: 'isLogin', data: true });
          if (type === 'login') {
            this.sendMessage('getData').then(async data => {
              if (data.exists) {
                const confirm = await this.$dialog.confirm({
                  text: `oTab data is found in your account, Override current local data with backup data?`,
                  title: 'Override data',
                });
                if (confirm) {
                  this.$browser.storage.sync.set({ ...data.data }).then(() => {
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  });
                }
              }
            });
          }
          user && !user.emailVerified ? (this.tab = 1) : (this.visible = false);
        })
        .catch(err => {
          this.loading = false;
          this.$dialog.notify.error(err.message);
        });
    },
  },
  computed: {
    text() {
      return this.loginSection
        ? {
            text1: 'Login into your account',
            text2: "Don't have an account?",
            text3: 'sign up',
            text4: 'login',
          }
        : {
            text1: 'Sign up to to create new account and back up your data to cloud',
            text2: 'Already have an account?',
            text3: 'login',
            text4: 'sign up',
          };
    },
  },
  created() {
    Bus.$on('auth', () => {
      this.visible = true;
      this.tab = 0;
    });
  },
};
</script>
<style lang="scss">
.close-auth {
  position: absolute;
  cursor: pointer;
  top: 20px;
  right: 30px;
}
</style>
