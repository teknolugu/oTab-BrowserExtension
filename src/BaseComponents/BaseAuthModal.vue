<template>
  <modal name="auth" width="800px" height="500px" class="auth-modal">
    <div class="bg-primary h-full flex flex-col justify-center inline-block text-inverse p-6" style="width: 300px">
      <p class="font-bold text-2xl"><span class="font-medium">o</span>Tab</p>
      <p class="text-base mt-3">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
      </p>
      <div class="text-inverse mt-2">
        <button-ui size="small" @click="isLogin = !isLogin" class="bg-inverse border text-inverse inline-block">
          {{ isLogin ? 'Sign up' : 'Login' }}
        </button-ui>
      </div>
    </div>
    <div class="inline-block p-6 flex-grow">
      <div>
        <button-icon icon="angle-left" v-if="forgotPassword" @click="forgotPassword = false"></button-icon>
        <p class="text-xl font-medium inline-block" v-show="!forgotPassword">{{ isLogin ? 'Login' : 'Create an account' }}</p>
        <button-icon icon="multiply" class="float-right" @click="$modal.hide('auth')"></button-icon>
      </div>
      <div class="mt-12">
        <template v-if="forgotPassword">
          <ValidationProvider tag="div" rules="required|email" v-slot="{ errors, invalid, failed }">
            <input-ui placeholder="Email" :error="failed" large input-style="background" v-model="email" block />
            {{ errors[0] }}
            <button-ui class="mt-8" block :disabled="invalid">Send reset email</button-ui>
          </ValidationProvider>
        </template>
        <template v-else>
          <ValidationObserver v-slot="{ invalid }">
            <form @submit.prevent="formHandler">
              <ValidationProvider class="mb-6" tag="div" rules="required" v-slot="{ errors, failed }" v-if="!isLogin">
                <input-ui :error="failed" type="text" large input-style="background" v-model="name" placeholder="Name" block></input-ui>
                {{ errors[0] }}
              </ValidationProvider>
              <ValidationProvider class="mb-6" tag="div" rules="required|email" v-slot="{ errors, failed }">
                <input-ui :error="failed" type="text" large input-style="background" v-model="email" placeholder="Email" block></input-ui>
                {{ errors[0] }}
              </ValidationProvider>
              <ValidationProvider class="mb-10" tag="div" :rules="!isLogin ? 'required|min:8' : 'required'" v-slot="{ errors, failed }">
                <input-ui
                  large
                  :error="failed"
                  input-style="background"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'eye-slash' : 'eye'"
                  v-model="password"
                  @click:append="showPassword = !showPassword"
                  block
                  placeholder="Password"
                ></input-ui>
                {{ errors[0] }}
              </ValidationProvider>
              <p class="text-right text-sm text-primary cursor-pointer" @click="forgotPassword = true">Forgot your password?</p>
              <button-ui :loading="isLoading" button-type="submit" class="mt-3" :disabled="invalid" block>
                {{ isLogin ? 'Login' : 'Sign up' }}
              </button-ui>
            </form>
          </ValidationObserver>
        </template>
      </div>
    </div>
  </modal>
</template>
<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  components: { ValidationProvider, ValidationObserver },
  data() {
    return {
      isLoading: false,
      forgotPassword: false,
      isLogin: true,
      name: '',
      email: '',
      password: '',
      showPassword: false,
    };
  },
  methods: {
    formHandler() {
      this.isLoading = true;
      const timeout = setTimeout(() => {
        this.isLoading = false;
        this.$toast.error('Connection timeout');
      }, 10000);

      if (this.isLogin) this.login();
      else this.signUp();
    },
    login() {
      this.$sendMessage('login', {
        email: this.email,
        password: this.password,
      })
        .then(user => {
          this.$store.commit('changeModules', { key: 'user', value: { isLogin: true, ...user } });
          clearTimeout(this.timeout);
          this.checkUserData();
        })
        .catch(err => {
          this.$toast.error('Wrong email/password');
          clearTimeout(this.timeout);
          this.isLoading = false;
        });
    },
    signUp() {
      const timeout = setTimeout(() => {
        this.isLoading = false;
        this.$toast.error('Connection timeout');
      }, 10000);
      this.$sendMessage('signUp', {
        name: this.name,
        email: this.email,
        password: this.password,
      })
        .then(user => {
          this.$store.commit('changeModules', { key: 'user', value: { isLogin: true, ...user } });
          this.$toast.info('Check email inbox to verify your email');

          this.$modal.hide('auth');
          clearTimeout(this.timeout);
          this.isLoading = false;
        })
        .catch(err => {
          this.$toast.error('Email already use by another account');
          clearTimeout(this.timeout);
          this.isLoading = false;
        });
    },
    checkUserData() {
      this.$sendMessage('getData')
        .then(result => {
          this.$modal.hide('auth');
          if (result.exists) {
            this.$store.commit('ui/toDefault');
            this.$router.push('/');
            this.$store.dispatch('overrideLocalData', result.data);
            this.isLoading = false;
          }
        })
        .catch(() => {
          this.$modal.hide('auth');
          this.isLoading = false;
        });
    },
    sendResetEmail() {
      this.$sendMessage('sendPasswordResetEmail', {
        email: this.email,
      }).then(() => this.$toast.info('Check your email inbox'));
    },
  },
};
</script>
<style>
.auth-modal .v--modal-box {
  @apply rounded-lg bg-gray-100 flex;
}
</style>
