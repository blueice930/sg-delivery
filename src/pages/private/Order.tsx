import React from 'react';
import { OrdersProvider } from 'src/contexts/OrderContext';

const Order = () => {
  const abc = 123;
  return (
    <OrdersProvider>
      <div>
        Order page
      </div>
    </OrdersProvider>
  );
};

export default Order;
