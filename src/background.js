const browser = require('webextension-polyfill');
import backup from './utils/backup';
import firebaseUtils from './utils/firebase/firebaseUtils';

browser.runtime.onMessage.addListener(request => {
  if (request.to === 'background') return firebaseUtils[request.type](request.data);
});

browser.runtime.onInstalled.addListener(async () => {
  const storage = browser.storage.sync;
  const items = ['boards', 'columns', 'items', 'labels', 'defaultBoard', 'settings', 'backup'];
  const getItems = await storage.get(items);

  if (Object.keys(getItems).length === 0) {
    storage.set({
      boards: {},
      columns: {},
      items: {},
      labels: {},
      settings: {},
      backup: {},
      defaultBoard: '',
    });
  }
});

// browser.alarms.create('backup', {
// 	periodInMinutes: 0.10
// })
// browser.alarms.onAlarm.addListener(alarm => {
// 	alert('test')
// 	console.log(alarm)
// })
