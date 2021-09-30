import initFirebase from '../../helpers/initFirebase';
import {functions} from '../../helpers/initFirebaseFunctions';
import {getOrdersFn} from './getOrdersFn';
import {getOrderByUidFn} from './getOrderByUidFn';
import {createOrderFn} from './createOrderFn';
import {deleteOrderFn} from './deleteOrderFn';
import {payOrderByBalanceFn} from './payOrderByBalanceFn';
import {payOrderByAlipayFn} from './payOrderByAlipayFn';

initFirebase();

const getOrders = functions.onCall(getOrdersFn);
const getOrderByUid = functions.onCall(getOrderByUidFn);
const createOrder = functions.onCall(createOrderFn);
const deleteOrder = functions.onCall(deleteOrderFn);
const payOrderByBalance = functions.onCall(payOrderByBalanceFn);
const payOrderByAlipay = functions.onCall(payOrderByAlipayFn);

export {
  getOrders,
  getOrderByUid,
  createOrder,
  deleteOrder,
  payOrderByBalance,
  payOrderByAlipay,
};
