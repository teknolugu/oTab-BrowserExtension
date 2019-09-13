import firebase from './firebase';

global.browser = require('webextension-polyfill');

browser.alarms.create('backup', {
  delayInMinutes: 1,
  periodInMinutes: 10,
});

browser.alarms.onAlarm.addListener(async () => {
  const user = firebase.auth().currentUser;
  if (user && user.emailVerified) {
    const { disableBackup } = await browser.storage.sync.get('disableBackup');
    if (!disableBackup) {
      const { backupTime } = await browser.storage.sync.get('backupTime');
      if (typeof backupTime === 'undefined' || Date.now() > backupTime) {
        backupData();
      }
    }
  }
});

class FirebaseUtils {
  updateName({ name }) {
    firebase.auth().currentUser.updateProfile({
      displayName: name,
    });
  }

  deleteUserData() {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .delete();
  }

  backupData() {
    return new Promise(async (resolve, reject) => {
      const db = firebase.firestore();
      const { boards, notes, tasks, collections } = await browser.storage.sync.get(['boards', 'notes', 'tasks', 'collections']);
      try {
        db.collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({ boards, notes, tasks, collections });
        const { backupInterval } = await browser.storage.sync.get('backupInterval');
        browser.storage.sync.set({ backupTime: Date.now() + backupInterval, lastBackup: Date.now() });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  signUp({ name, email, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
        user.updateProfile({
          displayName: name,
        });
        user.sendEmailVerification();
        resolve({
          name,
          email,
          emailVerified: false,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  login({ email, password }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
        resolve({
          name: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          lastLogin: user.metadata.lastSignInTime,
          createdAt: user.metadata.creationTime,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  getData() {
    return new Promise(async (resolve, reject) => {
      try {
        const dataPromise = await firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .get();
        const data = await dataPromise.data();
        const returnData = { exists: dataPromise.exists, data: { ...data } };
        resolve(returnData);
      } catch (err) {
        reject(err);
      }
    });
  }

  resendVerifyEmail() {
    return new Promise((resolve, reject) => {
      firebase.auth().currentUser.sendEmailVerification();
      resolve();
    });
  }

  sendPasswordResetEmail({ email }) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => resolve())
        .catch(err => reject(err.message));
    });
  }

  deleteAccount({ password }) {
    return new Promise((resolve, reject) => {
      const user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
      user
        .reauthenticateWithCredential(credential)
        .then(async () => {
          try {
            user.delete();
            this.deleteUserData();
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .catch(err => reject(err));
    });
  }

  getUser() {
    return new Promise((resolve, reject) => {
      const user = firebase.auth().currentUser;
      if (user) {
        resolve({
          name: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          lastLogin: user.metadata.lastSignInTime,
          createdAt: user.metadata.creationTime,
        });
      } else {
        resolve(null);
      }
    });
  }

  signOut() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut();
      resolve();
    });
  }
}

export default new FirebaseUtils();
