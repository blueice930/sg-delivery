import {firestore} from 'firebase-admin';
import {v4 as uuidv4} from 'uuid';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {Item, ItemStatus} from './types';

export const createItemFn = async (data:any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError cause authentication failed.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {auth: {uid: userId}} = context;

  const uid = uuidv4();
  const packageId = data?.packageId;
  const deliveryCompany = data?.deliveryCompany;
  const itemName = data?.itemName;
  const itemQuantity = data?.itemQuantity;
  const itemPrice = data?.itemPrice;
  const comments = data?.comments;

  if (!packageId) {
    // Throwing an HttpsError cause no packageId arg.
    throw new https.HttpsError('invalid-argument',
        'Package Id is required.', 'Create item failed');
  }
  if (!itemName) {
    // Throwing an HttpsError cause no itemName arg.
    throw new https.HttpsError('invalid-argument',
        'Item Name is required.', 'Create item failed');
  }
  if (!itemQuantity) {
    // Throwing an HttpsError cause no itemQuantity arg.
    throw new https.HttpsError('invalid-argument',
        'Item Quantity is required.', 'Create item failed');
  }
  if (!itemPrice) {
    // Throwing an HttpsError cause no itemQuantity arg.
    throw new https.HttpsError('invalid-argument',
        'Item Price is required.', 'Create item failed');
  }

  const createdAt = firestore.Timestamp.now().toMillis();
  const item: Item = {
    uid,
    packageId,
    userId,
    deliveryCompany,
    itemName,
    itemQuantity,
    itemPrice,
    status: ItemStatus.CREATED,
    comments,
    createdAt,
  };
  const db = firestore();
  const batch = db.batch();
  const itemRef = db.collection('items').doc(uid);
  batch.set(itemRef, item);

  const userRef = db.collection('users').doc(userId);
  batch.update(userRef, {itemUids: firestore.FieldValue.arrayUnion(uid)});

  await batch.commit();

  const response: FunctionResponse = {
    success: true,
    data: item,
  };
  return response;
};

