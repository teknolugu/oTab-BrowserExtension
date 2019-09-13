import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import * as config from './assets/firebase-config.json';

const firebaseConfig = { ...config.default };

firebase.initializeApp(firebaseConfig);

export default firebase;
