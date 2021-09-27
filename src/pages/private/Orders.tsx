import React from 'react';
import OrdersTableView from 'src/components/OrdersTableView';
import { OrdersProvider } from 'src/contexts/OrderContext';

const Orders = () => {
  const abc = 123;
  return (
    <OrdersProvider>
      <OrdersTableView />
    </OrdersProvider>
  );
};

export default Orders;
