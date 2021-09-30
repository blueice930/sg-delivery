import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {Order} from './types';

export const getOrdersFn = async (data:any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {auth: {uid: userId}} = context;
  const orders: Order[] = [];
  const db = firestore();
  const ordersRef = db.collection('orders');
  const userRef = db.collection('users').doc(userId);
  const totalCount = (await userRef.get()).data()?.orderUids?.length || 0;
  const cursor = data?.cursorId;

  try {
    const cursorRef = cursor ?
    (await ordersRef.where('uid', '==', cursor).get()).docs[0] :
    0;
    const ordersSnapshot = await ordersRef
        .where('userId', '==', userId)
        .orderBy('createdAt', 'asc')
        .startAfter(cursorRef)
        .limit(100)
        .get();
    ordersSnapshot.forEach((orderData) => {
      const data = orderData.data();
      const order: Order = {
        uid: data?.uid,
        userId: data.userId,
        itemUids: data.itemUids,
        status: data?.status,
        price: data?.price,
        discountCode: data?.discountCode,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
      };
      orders.push(order);
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new https.HttpsError('unknown',
          'Error getting documents', e?.message);
    }
  }

  const response: FunctionResponse = {
    success: true,
    data: {
      orders,
      totalCount,
    },
  };
  return response;
};
