import React, { useCallback, useState } from 'react';
import { Button } from '@material-ui/core';
import { useOrders } from 'src/contexts/OrderContext';
import { useItems } from 'src/contexts/ItemContext';

const CreateOrderBtn = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { createOrder } = useOrders();
  const { selectedItemUids } = useItems();

  const handleBtnOnclick = useCallback(async () => {
    setIsCreating(true);
    await createOrder();
    setIsCreating(false);
  }, [createOrder]);

  return (
    <Button
      disabled={!selectedItemUids.length || isCreating}
      variant="contained"
      color="primary"
      onClick={handleBtnOnclick}
    >
      Create Order
    </Button>
  );
};

export default CreateOrderBtn;
