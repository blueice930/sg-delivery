import alipaySdk from './initAlipay';
import AlipayFormData from 'alipay-sdk/lib/form';
import {firestore} from 'firebase-admin';

const useAlipay = (amount: number, returnUrl: string, ) => {
  const formData = new AlipayFormData();
  formData.setMethod('get');
  formData.addField('notifyUrl', 'http://www.com/notify');
  formData.addField('returnUrl', 'https://www.google.com/');
  formData.addField('bizContent', {
    outTradeNo: firestore.Timestamp.now(),
    productCode: 'FAST_INSTANT_TRADE_PAY',
    totalAmount: '19999',
    subject: '商品',
    body: '商品详情',
    returnUrl: 'https://www.google.com/',
  });
};

export default useAlipay;
