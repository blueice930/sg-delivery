import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {Order} from './types';

export const getOrderByUidFn = async (data:any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }

  const {auth: {uid: userId}} = context;
  const db = firestore();
  const orderUid = data?.orderUid;
  if (!orderUid) {
    throw new https.HttpsError('not-found',
        'Order not found', 'Action failed');
  }

  const orderSnapshot = await db.collection('orders').doc(orderUid).get();
  const orderData = orderSnapshot.data();
  if (!orderSnapshot.exists) {
    throw new https.HttpsError('cancelled',
        'Order UID not provided', 'Action failed');
  }

  if (orderData?.userId !== userId) {
    throw new https.HttpsError('unauthenticated',
        'You are not authorized to view the requested data', 'Action failed');
  }

  const response: FunctionResponse = {
    success: true,
    data: orderData,
  };
  return response;
};
