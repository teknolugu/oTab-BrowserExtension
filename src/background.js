import './store/';
import { settings, oTabData } from './assets/default-data.json';

global.browser = require('webextension-polyfill');

browser.runtime.onInstalled.addListener(async () => {
  console.log(settings)
  let storage = browser.storage.local;
  let data = await browser.storage.sync.get('oTabData');
  browser.storage.sync.set({
    oTabSettings: settings
  })
  storage.set({
    homeCollection: 'primary_board=>0',
    myGallery: [],
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
