import initFirebase from '../../helpers/initFirebase';
import {functions} from '../../helpers/initFirebaseFunctions';
import {updateArrivedItemFn} from './updateArrivedItemFn';

initFirebase();

const updateArrivedItem = functions.onCall(updateArrivedItemFn);

export {
  updateArrivedItem,
};
