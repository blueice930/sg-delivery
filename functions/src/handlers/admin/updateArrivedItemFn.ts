import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {ItemStatus} from '../item/types';

export const updateArrivedItemFn = async (
    data:any, context: CallableContext
) => {
  if (!context.auth) {
    // check admin authentication.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }
  const {auth: {uid}} = context;
  const db = firestore();

  const userRef = db.collection('users').doc(uid);
  const userSnapshot = await userRef.get();
  const userData = userSnapshot.data();
  const isAdmin = userData?.admin;
  if (!isAdmin) {
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }

  const packageId = data?.packageId;
  // Item Price is purchase price, Delivery price is what user paid.
  const deliveryPrice = data?.price;

  // check param
  if (!packageId) {
    throw new https.HttpsError('cancelled',
        `No package Id provided`,
        'Update item failed');
  }

  if (typeof deliveryPrice !== 'number') {
    throw new https.HttpsError('cancelled',
        `Invalid Price`,
        'Update item failed');
  }

  const itemSnapshot = await db.collection('items')
      .where('packageId', '==', packageId).limit(1).get();

  // check items exists
  if (itemSnapshot.empty) {
    throw new https.HttpsError('cancelled',
        `Item Id not exists.`,
        'Update item failed');
  }

  const itemRef = itemSnapshot.docs[0].ref;
  itemRef.update({status: ItemStatus.ARRIVED_WAREHOUSE, deliveryPrice});

  const response: FunctionResponse = {
    success: true,
    data: null,
  };

  return response;
};

