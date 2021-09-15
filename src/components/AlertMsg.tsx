import React, { FC, useEffect, useState } from 'react';
import { isEmpty, capitalize } from 'lodash';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Collapse } from '@material-ui/core';

export interface AlertMsgProps {
  alertMsg: {
    title: string,
    message: string,
    details?: string,
  } | any,
  severity: Severity,
}

export enum Severity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}
const AlertMsg: FC<AlertMsgProps> = ({ alertMsg, severity } : AlertMsgProps) => {
  const [msg, setMsg] = useState<any>({});

  useEffect(() => {
    setMsg(alertMsg);
    return () => {};
  }, [alertMsg]);

  return (
    <Collapse in={!isEmpty(msg)}>
      {!isEmpty(msg) && (
        <Alert
          severity={severity}
          onClose={() => {
            setMsg({});
          }}
          closeText="Close"
        >
          <AlertTitle>{capitalize(msg.title)}</AlertTitle>
          {msg?.details}
          {msg?.message && msg?.details && (' - ')}
          <strong>{msg?.message}</strong>
        </Alert>
      )}
    </Collapse>
  );
};

export default AlertMsg;
