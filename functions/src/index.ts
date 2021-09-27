import initFirebase from './helpers/initFirebase';
import * as orderHandler from './handlers/order';
import * as itemHandler from './handlers/item';
import * as userHandler from './handlers/user';
import * as adminHandler from './handlers/admin';

initFirebase();

export const item = itemHandler;
export const order = orderHandler;
export const user = userHandler;
export const admin = adminHandler;

