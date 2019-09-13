import Vue from 'vue';
import App from './App';
import store from '../store';

import vuetify from '../vuetify';
import Icons from './icons';

Vue.prototype.$icons = Icons;

import '../assets/style.scss';
import '../assets/fonts.css';

global.browser = require('webextension-polyfill');

Vue.mixin({
  methods: {
    sendMessage(type, data = null) {
      return browser.runtime.sendMessage({ type, data });
    },
  },
});

Vue.prototype.$browser = global.browser;

new Vue({
  el: '#app',
  vuetify,
  store,
  render: h => h(App),
});
