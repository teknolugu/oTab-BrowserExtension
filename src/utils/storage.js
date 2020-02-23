const browser = require('webextension-polyfill');

export function setStorage(key, value) {
  return browser.storage.sync.set({
    [key]: value,
  });
}

export function getStorage(key) {
  return browser.storage.sync.get(key);
}
