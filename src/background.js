const browser = require('webextension-polyfill');
import backup from './utils/backup';
import firebaseUtils from './utils/firebase/firebaseUtils';
import { setStorage, getStorage } from './utils/storage';

browser.runtime.onMessage.addListener(request => {
  if (request.to === 'background') return firebaseUtils[request.type](request.data);
});

browser.runtime.onInstalled.addListener(async () => {
  const items = ['boards', 'columns', 'items', 'labels', 'defaultBoard', 'settings', 'backup', 'user'];
  const getItems = await getStorage(items);

  if (Object.keys(getItems).length === 0) {
    setStorage({
      boards: {},
      columns: {},
      items: {},
      labels: {},
      settings: {},
      backup: {},
      user: {},
      defaultBoard: '',
    });
  }
});
