import Vue from 'vue';
import App from './App';
import store from '../store/';
import '../assets/style.scss';

global.browser = require('webextension-polyfill');

// Element UI
browser.storage.local.get('oTabSettings').then(settings => {
  settings.oTabSettings.dark ? import('element-theme-dark') : import('element-ui/lib/theme-chalk/index.css');
});
import './element';

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
