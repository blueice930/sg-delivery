import initFirebase from '../../helpers/initFirebase';
import {functions} from '../../helpers/initFirebaseFunctions';

import {paymentNotifyFn} from './paymentNotifyFn';

initFirebase();

const notifyPayment = functions.onRequest((req) => paymentNotifyFn(req));


export {
  notifyPayment,
};
