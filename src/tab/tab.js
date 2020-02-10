import Vue from 'vue';
import App from './App';
import store from '../store';
import router from './router';

// Plugin
import './plugins/vue-unicons';
import './plugins/v-tooltip';
import './plugins/vue-js-modal';

// CSS
import '../assets/css/tailwind.css';
import '../assets/css/style.css';
import '../assets/css/fonts.css';
import 'vue2-animate/dist/vue2-animate.min.css';

// UI Components
import './components/ui';

// Directives
import '../directives/VAutofocus';

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
