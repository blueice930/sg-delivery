import React from 'react';
import { useItems } from 'src/contexts/ItemContext';
import { useOrders } from 'src/contexts/OrderContext';
import AlertMsg from './AlertMsg';

const AlertGroup = () => {
  const { severity: itemSev, alert: itemAlert } = useItems();
  const { severity: orderSev, alert: orderAlert } = useOrders();
  return (
    <div>
      <AlertMsg severity={itemSev} alertMsg={itemAlert} />
      <AlertMsg severity={orderSev} alertMsg={orderAlert} />
    </div>
  );
};

export default AlertGroup;
