import {apps, initializeApp} from 'firebase-admin';

export default () => {
  if (!apps.length) {
    initializeApp();
  }
};
