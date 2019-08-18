import './store/';
import { oTabData, settings } from './assets/default-data.json';

global.browser = require('webextension-polyfill');

browser.runtime.onInstalled.addListener(async () => {
  let storage = browser.storage.local;
  let data = await browser.storage.sync.get('oTabData');
  storage.set({
    oTabSettings: settings,
    homeCollection: 'primary_board=>0',
    myGallery: [],
  });
  storage.set({ dataExist: '' });
  if (Object.entries(data).length === 0 && data.constructor === Object) {
    storage.set({
      starBoard: '',
      oTabMenu: '0',
    });
    storage.set({
      oTabData: oTabData,
    });
  } else {
    storage.set({
      oTabData: data.oTabData,
    });
  }
});
