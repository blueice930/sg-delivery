import React, { useRef, useState } from 'react';

import { ItemsProvider } from 'src/contexts/ItemContext';
import AddItemModal from 'src/components/AddItemModal';
import ItemsView from 'src/components/ItemsView';

const Order = () => (
  <ItemsProvider>
    <div>
      <ItemsView />
      <AddItemModal />
    </div>
  </ItemsProvider>
);

export default Order;
