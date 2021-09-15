import React from 'react';
import { Button } from '@material-ui/core';
import { useOrders } from 'src/contexts/OrderContext';
import { useItems } from 'src/contexts/ItemContext';

const CreateOrderView = () => {
  const { handleCreateOrder } = useOrders();
  const { selectedItemUids } = useItems();

  return (
    <Button disabled={!selectedItemUids.length} variant="contained" color="primary" onClick={handleCreateOrder}>
      Create Order
    </Button>
  );
};

export default CreateOrderView;
