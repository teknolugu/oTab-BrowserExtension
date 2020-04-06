import Vue from 'vue';
import App from './App';
import store from '../store';
import router from './router';

// Plugin
import './plugins/vue-unicons';
import './plugins/v-tooltip';
import './plugins/vue-js-modal';
import './plugins/vee-validate';
import './plugins/vue-toastification';
import './plugins/vue-meta';

// CSS
import '../assets/scss/base/tailwind.scss';
import '../assets/scss/style.scss';
import '../assets/css/fonts.css';
import '../assets/css/theme.css';
import 'vue2-animate/dist/vue2-animate.min.css';

// UI Components
import '~/BaseComponents';

// Directives
import '../directives/VAutofocus';

Vue.filter('stripHTML', value => {
  return value.replace(/<[^>]*>?/gm, '');
});

global.browser = require('webextension-polyfill');

Vue.prototype.$title = title => (document.title = title);
Vue.prototype.$browser = global.browser;
Vue.prototype.$sendMessage = (type, data) => browser.runtime.sendMessage({ to: 'background', type, data });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
