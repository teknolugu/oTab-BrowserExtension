import * as defaultData from './assets/default-data.json';

import firebaseUtils from './firebase-utils';

global.browser = require('webextension-polyfill');

browser.runtime.onMessage.addListener(request => firebaseUtils[request.type](request.data));

// Set Data Into Storage when extension installed

browser.runtime.onInstalled.addListener(() => {
  const requireData = ['oTabSettings', 'boards', 'collections', 'notes', 'tasks', 'starBoard', 'oTabMenu', 'homeCollection', 'backupInterval'];
  browser.storage.local.set({
    myGallery: [],
  });
  const storage = browser.storage.sync;
  requireData.forEach(async item => {
    const isDataExist = await storage.get(item);
    if (Object.entries(isDataExist).length === 0 && isDataExist.constructor === Object) {
      storage.set({
        [item]: defaultData.default[item],
      });
    } else {
      storage.set({
        [item]: isDataExist[item],
      });
    }
  });
});
