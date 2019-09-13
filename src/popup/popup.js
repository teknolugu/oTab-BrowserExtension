import Vue from 'vue';
import App from './App';
import store from '../store';
import '../assets/style.scss';

import vuetify from '../vuetify';
import Icons from './icons';

Vue.prototype.$icons = Icons;

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  vuetify,
  store,
  render: h => h(App),
});
