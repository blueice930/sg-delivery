import React from 'react';
import { Button } from '@material-ui/core';
import { updateArrivedItem } from 'src/firebase';

const Shop = () => {
  const test = async () => {
    // const res = await updateArrivedItem({ packageId: 'SDUF1238497' });
  };
  return (
    <div>
      Shop page
      <Button
        variant="contained"
        color="primary"
        onClick={test}
      >
        test
      </Button>
    </div>
  );
};

export default Shop;
