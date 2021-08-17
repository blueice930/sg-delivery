import {CallableContext} from 'firebase-functions/v1/https';

export const deleteItemFn = (data: any, context: CallableContext) => {
  const {auth} = context;
  console.log(context?.auth?.uid);
  return `item from ${auth?.uid} deleted!`;
};
