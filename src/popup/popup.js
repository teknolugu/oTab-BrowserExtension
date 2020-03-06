import Vue from 'vue';
import App from './App';
import store from '../store';

// Plugins
import './plugins/v-tooltip';
import './plugins/vue-unicons';

// CSS
import '../assets/scss/base/tailwind.scss';
import '../assets/scss/style.scss';
import '../assets/css/fonts.css';
import '../assets/css/theme.css';

// UI Components
import '@/BaseComponents';

// Directives
import '../directives/VAutofocus';

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
