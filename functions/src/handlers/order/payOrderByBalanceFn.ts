import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {ItemStatus} from '../item/types';
import {OrderStatus} from './types';

export const payOrderByBalanceFn = async (
    data: any, context: CallableContext
) => {
  if (!context.auth) {
    // Authenticate.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {auth: {uid: userId}} = context;
  const orderUid = data?.orderUid;
  const db = firestore();
  const orderSnapshot = await db.collection('orders').doc(orderUid).get();

  // check order exists
  if (!orderSnapshot.exists) {
    throw new https.HttpsError('cancelled',
        'No Order Found', 'Payment failed');
  }
  const orderData = orderSnapshot.data();
  const itemUids = orderData?.itemUids || [];

  // check order has items
  if (!itemUids.length) {
    throw new https.HttpsError('cancelled',
        'Empty order, no items to pay', 'Payment failed');
  }

  const itemsSnapshot = await db.collection('items')
      .where(firestore.FieldPath.documentId(), 'in', itemUids).get();
  // check items exists
  if (itemsSnapshot.size === 0) {
    throw new https.HttpsError('cancelled',
        `Empty order, no items to pay.`,
        'Payment failed');
  }

  // get total amount
  let totalPrice: number = 0;
  itemsSnapshot.forEach((item) => {
    totalPrice += item.data()?.deliveryPrice || 0;
  });

  // get user balance
  const userSnapshot = await db.collection('users').doc(userId).get();
  const balance = userSnapshot.data()?.wallet?.balance || 0;

  if (balance < totalPrice) {
    const failRes: FunctionResponse = {
      success: false,
      data: `Insufficient Balance: ${balance}`,
    };
    return failRes;
  } else {
    const batch = db.batch();
    batch.update(userSnapshot.ref, {wallet: {balance: balance - totalPrice}});
    itemsSnapshot.forEach((item) => {
      batch.update(item.ref, {status: ItemStatus.SHIPPING});
    });
    batch.update(orderSnapshot.ref, {
      status: OrderStatus.PAID, updatedAt: firestore.Timestamp.now().toMillis(),
    });
    await batch.commit();

    const res: FunctionResponse = {
      success: true,
      data: orderData,
    };
    return res;
  }
};
