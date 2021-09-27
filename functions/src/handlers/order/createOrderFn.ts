import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {v4 as uuidv4} from 'uuid';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {ItemStatus} from '../item/types';
import {Order, OrderStatus} from './types';

export const createOrderFn = async (data:any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError cause authentication failed.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {auth: {uid: userId}} = context;
  const uid = uuidv4();
  const itemUids = data?.itemUids;
  const createdAt = firestore.Timestamp.now().toMillis();

  if (!itemUids?.length) {
    // Throwing an HttpsError cause empty item uids
    throw new https.HttpsError('invalid-argument',
        'Item Ids are required.', 'Create order failed');
  }

  const db = firestore();

  const itemsSnapshot = await db.collection('items')
      .where(firestore.FieldPath.documentId(), 'in', itemUids).get();
  // check items exists
  if (itemsSnapshot.size === 0) {
    throw new https.HttpsError('cancelled',
        `Invalid Item Ids.`,
        'Create order failed');
  }

  // Check items are in warehouse
  itemsSnapshot.forEach((item) => {
    const status = item.data()?.status;
    const Uid = item.id;
    if (status !== ItemStatus.ARRIVED_WAREHOUSE) {
      // Throwing an HttpsError cause item not arrived warehouse yet
      throw new https.HttpsError('cancelled',
          `Item (UID: ${Uid}) has not arrived warehouse yet.`,
          'Create order failed');
    }
  });

  const order: Order = {
    uid,
    userId,
    itemUids,
    status: OrderStatus.UNPAID,
    createdAt,
    updatedAt: createdAt,
  };

  const batch = db.batch();
  const orderRef = db.collection('orders').doc(uid);
  batch.set(orderRef, order);

  const userRef = db.collection('users').doc(userId);
  batch.update(userRef, {orderUids: firestore.FieldValue.arrayUnion(uid)});

  itemsSnapshot.forEach((item) => {
    batch.update(item.ref, {status: ItemStatus.COMBINED});
  });

  await batch.commit();

  const response: FunctionResponse = {
    success: true,
    data: order,
  };

  return response;
};

