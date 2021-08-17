import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {User} from './types';

export const fetchUserFn = async (data: any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {email} = data;
  const {auth: {uid}} = context;
  const db = firestore();
  const userRef = db.collection('users').doc(uid);
  const userSnapshot = await userRef.get();
  const isUserExists = await userSnapshot.exists;
  if (!isUserExists) {
    // TODO: // maybe: userRef.set({id: uid, email});
  }
  const result = userSnapshot.data();
  const user: User = {
    id: result?.id,
    email: result?.email,
    fname: result?.fname,
    lname: result?.lname,
    displayName: result?.displayName,
    age: result?.age,
    phone: result?.phone,
    wallet: result?.wallet,
  };

  const response: FunctionResponse = {
    success: true,
    data: user,
  };
  return response;
};

