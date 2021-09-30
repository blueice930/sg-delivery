import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';
import {https} from '../../helpers/initFirebaseFunctions';
import {FunctionResponse} from '../../helpers/types';
import alipaySdk from '../../helpers/initAlipay';
import AlipayFormData from 'alipay-sdk/lib/form';

export const payOrderByAlipayFn = async (
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
  const formData = new AlipayFormData();
  formData.setMethod('get');
  formData.addField('notifyUrl', 'http://uyqd9j.natappfree.cc/deliveryapp-5b58e/asia-southeast1/payment-notifyPayment');
  formData.addField('returnUrl', 'https://www.google.com/');
  formData.addField('bizContent', {
    outTradeNo: firestore.Timestamp.now().toMillis(),
    productCode: 'FAST_INSTANT_TRADE_PAY',
    totalAmount: totalPrice,
    subject: 'Gucci Limited Edition',
    body: 'Gucci Handbag',
  });

  const result = await alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      {formData: formData},
  );
  return result;
};
