import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {User} from './types';

export const registerUserFn = async (data:any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {auth: {uid}} = context;
  const fname = data?.fname;
  const lname = data?.lname;
  const email = data?.email;
  const address = data?.address;

  const fullname = `${fname} ${lname}`;
  const user: User = {
    id: uid,
    displayName: fullname,
    fname,
    lname,
    email,
    address,
    wallet: {balance: 0},
  };
  const db = firestore();
  const userRef = db.collection('users').doc(uid);
  const userSnapshot = await userRef.get();
  const isUserExists = await userSnapshot.exists;
  if (isUserExists) {
    // TODO
    const res: FunctionResponse = {success: false, data: null};
    return res;
  }
  userRef.set(user);
  const res: FunctionResponse = {
    success: true,
    data: user,
  };
  return res;
};

