const browser = require('webextension-polyfill');

const storage = browser.storage.local;

export function setStorage(key, value) {
  if (typeof key === 'object') return storage.set(key);

  const copyValue = JSON.parse(JSON.stringify(value));

  return storage.set({
    [key]: copyValue,
  });
}

export function getStorage(key) {
  return storage.get(key);
}
