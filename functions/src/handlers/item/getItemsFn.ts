import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {Item, ItemStatus, LiveItemStatus} from './types';


export const getItemsFn = async (data: any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {auth: {uid: userId}} = context;
  const items: Item[] = [];
  const db = firestore();
  const itemsRef = db.collection('items');
  const userRef = db.collection('users').doc(userId);
  const totalCount = (await userRef.get()).data()?.itemUids?.length || 0;
  const cursor = data?.cursorId;
  try {
    const cursorRef = cursor ?
    (await itemsRef.where('uid', '==', cursor).get()).docs[0] :
    0;
    const itemsSnapshot = await itemsRef
        .where('userId', '==', userId)
        .where('status', 'in', LiveItemStatus)
        .orderBy('createdAt', 'asc')
        .startAfter(cursorRef)
        .limit(50)
        .get();
    itemsSnapshot.forEach((itemData) => {
      const data = itemData.data();
      const item = {
        uid: data?.uid,
        packageId: data?.packageId,
        deliveryCompany: data?.deliveryCompany,
        userId: data?.userId,
        status: data?.status,
        itemName: data?.itemName,
        itemQuantity: data?.itemQuantity,
        createdAt: data?.createdAt,
        arrivedAt: data?.arrivedAt,
        combinedAt: data?.combinedAt,
        orderId: data?.orderId,
        weight: data?.weight,
        size: data?.size,
        comments: data?.comments,
      };
      items.push(item);
    });
  } catch (e) {
    throw new https.HttpsError('unknown',
        'Error getting documents', e?.message);
  }
  const response: FunctionResponse = {
    success: true,
    data: {
      items,
      totalCount,
    },
  };
  return response;
};

