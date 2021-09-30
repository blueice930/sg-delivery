import initFirebase from '../../helpers/initFirebase';
import {getActiveItemsFn} from './getActiveItemsFn';
import {createItemFn} from './createItemFn';
import {deleteItemFn} from './deleteItemFn';
import {updateItemFn} from './updateItemFn';
import {functions} from '../../helpers/initFirebaseFunctions';
import {getItemsByUidsFn} from './getItemsByUidsFn';

initFirebase();

const getActiveItems = functions.onCall(getActiveItemsFn);
const getItemsByUids = functions.onCall(getItemsByUidsFn);
const createItem = functions.onCall(createItemFn);
const deleteItem = functions.onCall(deleteItemFn);
const updateItem = functions.onCall(updateItemFn);

export {
  getActiveItems,
  getItemsByUids,
  createItem,
  deleteItem,
  updateItem,
};
