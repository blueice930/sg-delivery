import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {Item, ActiveItemStatus} from './types';

export enum FetchType {
  ALL='ALL',
  ACTIVE='ACTIVE',
}

// todo fetch items by status. issue: Cannot get total count...
const getQuery = (
    itemsRef: firestore.CollectionReference, fetchType: string
) => {
  switch (fetchType) {
    case 'ACTIVE':
      return itemsRef.where('status', 'in', ActiveItemStatus);
    default:
      return itemsRef;
  }
};

export const getActiveItemsFn = async (data: any, context: CallableContext) => {
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
  const fetchType = data?.fetchType;
  try {
    const cursorRef = cursor ?
    (await itemsRef.where('uid', '==', cursor).get()).docs[0] :
    0;

    const query = getQuery(itemsRef, fetchType);
    const itemsSnapshot = await query
        .where('userId', '==', userId)
        .orderBy('createdAt', 'asc')
        .startAfter(cursorRef)
        .limit(100)
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
        itemPrice: data?.itemPrice,
        createdAt: data?.createdAt,
        arrivedAt: data?.arrivedAt,
        combinedAt: data?.combinedAt,
        orderId: data?.orderId,
        weight: data?.weight,
        size: data?.size,
        comments: data?.comments,
        deliveryPrice: data?.deliveryPrice,
      };
      items.push(item);
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
      items,
      totalCount,
    },
  };
  return response;
};

