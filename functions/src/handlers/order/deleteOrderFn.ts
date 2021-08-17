import {CallableContext} from 'firebase-functions/v1/https';

export const deleteOrderFn = (data:any, context: CallableContext) => {
  const {auth} = context;
  console.log(context?.auth?.uid);
  return `order from ${auth?.uid} deleted!`;
};

