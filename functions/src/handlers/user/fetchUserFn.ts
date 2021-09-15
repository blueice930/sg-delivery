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
  const configRef = db.collection('configs').doc('basic');
  const userSnapshot = await userRef.get();
  const configSnapshot = await configRef.get();
  const isUserExists = await userSnapshot.exists;
  if (!isUserExists) {
    const emptyUser = {
      id: uid,
      email,
    };
    userRef.set(emptyUser);
    const EmptyUserResponse: FunctionResponse = {
      success: true,
      data: {emptyUser},
    };
    return EmptyUserResponse;
  }
  const result = userSnapshot.data();
  const config = configSnapshot.data();
  const user: User = {
    id: result?.id,
    email: result?.email,
    fname: result?.fname,
    lname: result?.lname,
    displayName: result?.displayName,
    age: result?.age,
    address: result?.address,
    phone: result?.phone,
    wallet: result?.wallet,
    admin: result?.admin || false,
  };
  const storageAddress = config?.storageAddress;

  const response: FunctionResponse = {
    success: true,
    data: {user, storageAddress},
  };
  return response;
};

