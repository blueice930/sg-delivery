import React, { FC } from 'react';
import { isEmpty } from 'lodash';
import { Alert } from '@material-ui/lab';

export interface ErrorAlertMsgProps {
  error: {
    code: string,
    message: string,
    details?: string,
  } | any,
}
const ErrorAlertMsg: FC<ErrorAlertMsgProps> = ({ error } : ErrorAlertMsgProps) => {
  if (isEmpty(error)) return null;
  return (
    <Alert severity="error">
      {`${error?.code} - ${error?.message}`}
    </Alert>
  );
};

export default ErrorAlertMsg;
