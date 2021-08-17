import initFirebase from '../../helpers/initFirebase';
import {functions} from '../../helpers/initFirebaseFunctions';
import {getOrdersFn} from './getOrdersFn';
import {createOrderFn} from './createOrderFn';
import {deleteOrderFn} from './deleteOrderFn';

initFirebase();

const getOrders = functions.onCall(getOrdersFn);
const createOrder = functions.onCall(createOrderFn);
const deleteOrder = functions.onCall(deleteOrderFn);

export {
  getOrders,
  createOrder,
  deleteOrder,
};
