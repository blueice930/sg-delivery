import React, { FC, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
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
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (isEmpty(alertMsg)) {
      setOpen(true);
    }
    return () => {};
  }, [alertMsg, open]);

  return (
    <Collapse in={!isEmpty(alertMsg) && open}>
      <Alert
        severity={severity}
        onClose={() => setOpen(false)}
        closeText="Close"
      >
        <AlertTitle>{alertMsg.title}</AlertTitle>
        {alertMsg?.details}
        {alertMsg?.message && alertMsg?.details && (' - ')}
        <strong>{alertMsg?.message}</strong>
      </Alert>
    </Collapse>
  );
};

export default AlertMsg;
