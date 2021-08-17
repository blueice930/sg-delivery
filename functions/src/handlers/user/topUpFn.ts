import {CallableContext} from 'firebase-functions/v1/https';

export const topUpFn = (data:any, context: CallableContext) => {
  const {auth} = context;
  console.log(context?.auth?.uid);
  return `User ${auth?.uid} topped up $100!`;
};

