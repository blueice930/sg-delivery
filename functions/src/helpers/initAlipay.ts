import AlipaySdk from 'alipay-sdk';
const functions = require('firebase-functions');

const env = functions.config();
const alipaySdk = new AlipaySdk({
  appId: env?.alipay.app_id || '',
  signType: 'RSA2',
  alipayPublicKey: env?.alipay?.public || '',
  privateKey: env?.alipay?.private || '',
  gateway: env?.alipay?.gateway || '',
});

export default alipaySdk;
