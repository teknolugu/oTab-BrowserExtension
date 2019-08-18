import Vue from 'vue';
import App from './App';
import store from '../store/';
import '../assets/style.scss';

global.browser = require('webextension-polyfill');

// Element UI
browser.storage.sync.get('oTabSettings').then(settings => {
  settings.oTabSettings.dark ? import('element-theme-dark') : null;
});
import './element';

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
