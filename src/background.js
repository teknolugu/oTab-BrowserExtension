import './store/';
import { settings, oTabData } from './assets/default-data.json';

global.browser = require('webextension-polyfill');

browser.runtime.onInstalled.addListener(async () => {
  let storage = browser.storage.sync;
  let data = await storage.get('oTabData');
  browser.storage.local.set({
    myGallery: []
  })
  storage.set({
    oTabSettings: settings,
    homeCollection: 'primary_board=>0',
    starBoard: '',
    oTabMenu: '0',
  });
  storage.set({ dataExist: '' });
  if (Object.entries(data).length === 0 && data.constructor === Object) {
    storage.set({
      oTabData: oTabData,
    });
  } else {
    storage.set({
      oTabData: data.oTabData,
    });
  }
});
