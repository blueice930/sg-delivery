import {SSL_OP_EPHEMERAL_RSA} from 'constants';
import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import {Item} from './types';

export const getItemsByUidsFn = async (data:any, context: CallableContext) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new https.HttpsError('unauthenticated',
        'You are currently unauthenticated', 'Action failed');
  }

  const {auth: {uid: userId}} = context;
  const db = firestore();
  const itemUids = data?.itemUids || [];

  const emptyRes: FunctionResponse = {
    success: true,
    data: [],
  };
  if (!itemUids.length) {
    return emptyRes;
  }

  const resultItems: any[] = [];

  const itemsSnapshot = await db.collection('items')
      .where(firestore.FieldPath.documentId(), 'in', itemUids).get();
  if (itemsSnapshot.empty) {
    return emptyRes;
  }

  itemsSnapshot.forEach((item) => {
    const data = item.data();
    resultItems.push(data);
  });

  const response: FunctionResponse = {
    success: true,
    data: resultItems,
  };
  return response;
};
