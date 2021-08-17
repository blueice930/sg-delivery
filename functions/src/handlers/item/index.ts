import initFirebase from '../../helpers/initFirebase';
import {getItemsFn} from './getItemsFn';
import {createItemFn} from './createItemFn';
import {deleteItemFn} from './deleteItemFn';
import {updateItemFn} from './updateItemFn';
import {functions} from '../../helpers/initFirebaseFunctions';

initFirebase();

const getItems = functions.onCall(getItemsFn);
const createItem = functions.onCall(createItemFn);
const deleteItem = functions.onCall(deleteItemFn);
const updateItem = functions.onCall(updateItemFn);

export {
  getItems,
  createItem,
  deleteItem,
  updateItem,
};
