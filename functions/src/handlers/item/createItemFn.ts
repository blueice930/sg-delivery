import {firestore} from 'firebase-admin';
import {v4 as uuidv4} from 'uuid';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {Item, ItemStatus} from './types';

export const createItemFn = async (data:any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {auth: {uid: userId}} = context;
  const uid = uuidv4();
  const packageId = data?.packageId;
  const deliveryCompany = data?.deliveryCompany;
  const itemName = data?.itemName;
  const itemQuantity = data?.itemQuantity;
  const comments = data?.comments;

  if (!packageId) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('invalid-argument',
        'Package Id is required.', 'Create item failed');
  }
  if (!itemName) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('invalid-argument',
        'Item Name is required.', 'Create item failed');
  }
  if (!itemQuantity) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('invalid-argument',
        'Item Quantity is required.', 'Create item failed');
  }

  const createdAt = firestore.Timestamp.now().toMillis();
  const item: Item = {
    uid,
    packageId,
    userId,
    deliveryCompany,
    itemName,
    itemQuantity,
    status: ItemStatus.CREATED,
    comments,
    createdAt,
  };
  const db = firestore();
  const batch = db.batch();
  const userRef = db.collection('users').doc(userId);
  batch.update(userRef, {itemUids: firestore.FieldValue.arrayUnion(uid)});

  const itemRef = db.collection('items').doc(uid);
  batch.set(itemRef, item);

  const res = await batch.commit();
  console.log(`res`, res);

  const response: FunctionResponse = {
    success: true,
    data: item,
  };
  return response;
};

