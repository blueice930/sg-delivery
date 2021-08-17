import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {User} from './types';

export const updateUserFn = async (data:any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {auth: {uid}} = context;
  const db = firestore();
  const userRef = db.collection('users').doc(uid);
  const userSnapshot = await userRef.get();
  const isUserExists = await userSnapshot.exists;
  if (!isUserExists) {
    // TODO
  }
  userRef.update(data);
  const response: FunctionResponse = {
    success: true,
    data: {},
  };
  return response;
};

