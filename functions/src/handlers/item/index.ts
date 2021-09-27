import initFirebase from '../../helpers/initFirebase';
import {getActiveItemsFn} from './getActiveItemsFn';
import {createItemFn} from './createItemFn';
import {deleteItemFn} from './deleteItemFn';
import {updateItemFn} from './updateItemFn';
import {functions} from '../../helpers/initFirebaseFunctions';

initFirebase();

const getActiveItems = functions.onCall(getActiveItemsFn);
const createItem = functions.onCall(createItemFn);
const deleteItem = functions.onCall(deleteItemFn);
const updateItem = functions.onCall(updateItemFn);

export {
  getActiveItems,
  createItem,
  deleteItem,
  updateItem,
};
