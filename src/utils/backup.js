const browser = require('webextension-polyfill');
import firebase from './firebase';
import { setStorage, getStorage } from './storage';
import firebaseUtils from './firebase/firebaseUtils';

const backupIntervals = {
  day: 8.64e7,
  week: 6.048e8,
  month: 2.628e7,
};

firebase.auth().onAuthStateChanged(user => {
  if (user && user.emailVerified) {
    browser.alarms.get('backup').then(alarm => {
      console.log(typeof alarm);
      if (typeof alarm === 'undefined') {
        setStorage('backup', {
          active: true,
          interval: 'week',
          lastBackup: Date.now(),
        });
        browser.alarms.create('backup', {
          periodInMinutes: 5,
        });
      }
    });
  } else if (user === null) {
    browser.alarms.clear('backup');
  }
});

browser.alarms.onAlarm.addListener(({ name }) => {
  getStorage('backup').then(result => {
    const { lastBackup, interval, active } = result.backup;
    const isTimeToBackup = Date.now() > lastBackup + backupIntervals[interval];

    if (name === 'backup' && isTimeToBackup && active) {
      firebaseUtils.backupData().then(() => {
        setStorage('backup', {
          active: true,
          interval,
          lastBackup: Date.now(),
        });
      });
    }
  });
});
