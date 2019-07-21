import Vue from 'vue';
import App from './App';
import store from '../store/';
import '../assets/style.scss';

// Element UI
import './element'

import Unicon from 'vue-unicons';
import {
  uniGripHorizontalLine,
  uniLayers,
  uniNotes,
  uniWindow,
  uniPen,
  uniMultiply,
  uniFilePlusAlt,
  uniBold,
  uniUnderline,
  uniItalic,
  uniCode,
  uniClipboardNotes,
} from 'vue-unicons/src/icons';
Unicon.add([uniGripHorizontalLine, uniLayers, uniNotes, uniWindow, uniPen, uniMultiply, uniFilePlusAlt, uniBold, uniUnderline, uniItalic, uniCode, uniClipboardNotes]);
Vue.use(Unicon);

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
