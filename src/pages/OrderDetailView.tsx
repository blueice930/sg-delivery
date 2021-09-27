import React from 'react';
import { useOrders } from 'src/contexts/OrderContext';

const OrderDetailView = () => {
  const orders = useOrders();
  return (
    <div>
      OrderDetailView
    </div>
  );
};

export default OrderDetailView;
