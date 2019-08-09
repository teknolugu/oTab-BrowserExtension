import Vue from 'vue';
import App from './App';
import store from '../store/';
global.browser = require('webextension-polyfill');
import '../assets/style.scss';
import '../assets/fonts.css'

// Element UI
browser.storage.sync.get('oTabSettings').then(settings => {
	settings.oTabSettings.dark ? import('element-theme-dark') : import('element-ui/lib/theme-chalk/index.css')
})
import './element'

// Icons
import './icons'

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
