import React, { useCallback, useState } from 'react';
import {
  Button, CircularProgress, makeStyles,
} from '@material-ui/core';
import { useOrders } from 'src/contexts/OrderContext';
import { useItems } from 'src/contexts/ItemContext';

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: '5px',
  },
}));

const CreateOrderBtn = () => {
  const classes = useStyles();
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
      {isCreating && <CircularProgress className={classes.loading} size={20} color="secondary" />}
    </Button>
  );
};

export default CreateOrderBtn;
