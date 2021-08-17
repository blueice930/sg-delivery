import {CallableContext} from 'firebase-functions/v1/https';

export const getOrdersFn = (data:any, context: CallableContext) => {
  console.log(context?.auth?.uid);
  return `orders from ${context?.auth?.uid}, got em!`;
};
