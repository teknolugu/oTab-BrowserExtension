import './store/';

global.browser = require('webextension-polyfill');

browser.runtime.onInstalled.addListener(async e => {
  let storage = browser.storage.sync;
  let data = await storage.get('myApp');
  if (Object.entries(data).length === 0 && data.constructor === Object) {
    storage.set({
      myApp: {
        boards: [
          {
            title: 'Primary Board',
            id: 'primary_board',
            allTags: [
              { name: 'daily', color: '#7cd451', id: 'daily#7cd451' },
              { name: 'social', color: '#409EFF', id: 'social#409EFF' },
              { name: 'work', color: '#F56C6C', id: 'work#F56C6C' },
            ],
          },
        ],
        collections: {
          primary_board: [
            {
              title: 'my collections',
              tags: [{ name: 'daily', color: '#7cd451', id: 'daily#7cd451' }, { name: 'social', color: '#409EFF', id: 'social#409EFF' }],
              tabs: [
                {
                  title: 'Google',
                  url: 'https://google.com',
                  favIconUrl: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',
                },
                {
                  title: 'Facebook',
                  url: 'https://www.facebook.com',
                  favIconUrl: 'https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico',
                },
              ],
            },
          ],
        },
        notes: {
          primary_board: [
            {
              title: 'My Note',
              content: `<p>This is my first note</p>`,
              tags: [{ name: 'social', color: '#409EFF', id: 'social#409EFF' }],
              id: 'kx20rhdcrt',
            },
          ],
        },
        tasks: {
          primary_board: [
            {
              title: 'my task',
              tasks: [
                {
                  name: 'something',
                  done: false,
                },
                {
                  name: 'to do',
                  done: true,
                },
              ],
              tags: [{ name: 'daily', color: '#7cd451', id: 'daily#7cd451' }, { name: 'social', color: '#409EFF', id: 'social#409EFF' }],
            },
          ],
        },
      },
    });
  }
});
