import React from 'react';

import { ItemsProvider } from 'src/contexts/ItemContext';
import ItemsView from 'src/components/ItemsView';
import AlertGroup from 'src/components/AlertGroup';
import styled from 'styled-components';
import AddItemModal from 'src/components/AddItemModal';
import CreateOrderBtn from 'src/components/CreateOrderBtn';
import { OrdersProvider } from 'src/contexts/OrderContext';

const StyledBtnGroup = styled.div`
  margin: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const Items = () => (
  <ItemsProvider>
    <OrdersProvider>
      <AlertGroup />
      <ItemsView />
      <StyledBtnGroup>
        <AddItemModal />
        <CreateOrderBtn />
      </StyledBtnGroup>
    </OrdersProvider>
  </ItemsProvider>
);

export default Items;
