import Vue from 'vue';
import App from './App';
import store from '../store/';
import '../assets/style.scss';
import '../assets/fonts.css'

// Element UI
import './element'

// Icons
import './icons'

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
