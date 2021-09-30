import {firestore} from 'firebase-admin';
import {CallableContext} from 'firebase-functions/v1/https';


export const paymentNotifyFn = (req: any) => {
  const db = firestore();
  const outTradeNo = req?.body?.out_trade_no || '';
  if (outTradeNo) {
    db.collection('payments').doc(outTradeNo).set(req?.body || {});
  }
};
