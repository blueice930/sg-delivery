import * as firebaseFunctions from 'firebase-functions';

export const functions = firebaseFunctions.runWith({
  timeoutSeconds: 120,
  memory: '256MB',
}).region('asia-southeast1').https;

export const https = firebaseFunctions.https;
