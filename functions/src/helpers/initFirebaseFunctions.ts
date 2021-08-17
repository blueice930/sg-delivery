import * as firebaseFunctions from 'firebase-functions';

export const functions = firebaseFunctions.runWith({
  timeoutSeconds: 60,
  memory: '128MB',
}).region('asia-southeast1').https;

export const https = firebaseFunctions.https;
