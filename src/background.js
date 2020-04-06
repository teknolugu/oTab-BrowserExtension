import backup from './utils/backup';
import firebaseUtils from './utils/firebase/firebaseUtils';
import { setStorage, getStorage } from './utils/storage';

const browser = require('webextension-polyfill');

browser.runtime.onMessage.addListener(request => {
  if (request.to === 'background') return firebaseUtils[request.type](request.data);
});

browser.runtime.onInstalled.addListener(async () => {
  const items = ['boards', 'columns', 'items', 'labels', 'defaultBoard', 'settings', 'backup', 'user'];
  const getItems = await getStorage(items);

  if (Object.keys(getItems).length === 0) {
    setStorage({
      boards: {
        anu: {
          createdDate: Date.now(),
          title: 'primary board',
        },
      },
      columns: {
        anu: [{ id: 'una', labels: ['label1'], title: 'my column' }],
      },
      items: {
        una: [
          { content: 'click me to quick edit', done: false, id: 'task1', title: 'something to do', type: 'task' },
          { content: '<h1>Hi!!</h1>', title: 'my note', id: 'note1', type: 'note' },
          { favIconUrl: 'https://github.githubassets.com/favicon.ico', id: 'url1', title: 'oTab', type: 'tab', url: 'https://github.com/WinTenDev/oTab-BrowserExtension' },
        ],
      },
      labels: {
        anu: [{ color: '#4299e1', id: 'label1', name: 'work' }],
      },
      settings: {
        defaultNewTab: true,
      },
      backup: {},
      user: {
        isLogin: false,
        emailVerified: false,
      },
      defaultBoard: '',
    });
  }

  browser.tabs.create({
    active: true,
    url: browser.runtime.getURL('/tab/tab.html'),
  });
});

const regex = /chrome:\/\/newtab\/|about:newtab|about:home/g;
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (regex.test(tab.url)) {
    const { settings } = await getStorage('settings');

    if (settings.defaultNewTab) {
      browser.tabs.update(tabId, {
        url: '/tab/tab.html#/home',
      });
    }
  }
});
