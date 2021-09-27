import firebase from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  projectId: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  storageBucket: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_APP_ID,
  appId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = firebase.initializeApp(config);

const functions = firebase.app().functions('asia-southeast1');

// local test purpose
functions.useEmulator('localhost', 5001);
export const auth = app.auth();

const registerUser = functions.httpsCallable('user-registerUser');
const updateUser = functions.httpsCallable('user-updateUser');
const topUp = functions.httpsCallable('user-topUp');
const fetchUser = functions.httpsCallable('user-fetchUser');

const createOrder = functions.httpsCallable('order-createOrder');
const getOrders = functions.httpsCallable('order-getOrders');

const createItem = functions.httpsCallable('item-createItem');
const updateItem = functions.httpsCallable('item-updateItem');
const getActiveItems = functions.httpsCallable('item-getActiveItems');

const updateArrivedItem = functions.httpsCallable('admin-updateArrivedItem');

export {
  registerUser,
  updateUser,
  topUp,
  createOrder,
  getOrders,
  createItem,
  updateItem,
  getActiveItems,
  fetchUser,
  updateArrivedItem,
};

export default app;
