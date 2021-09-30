import React from 'react';

import ItemsView from 'src/components/ItemsView';
import AlertGroup from 'src/components/AlertGroup';
import styled from 'styled-components';
import AddItemModal from 'src/components/AddItemModal';
import CreateOrderBtn from 'src/components/CreateOrderBtn';

const StyledBtnGroup = styled.div`
  margin: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const Items = () => (
  <>
    <AlertGroup />
    <ItemsView />
    <StyledBtnGroup>
      <AddItemModal />
      <CreateOrderBtn />
    </StyledBtnGroup>
  </>
);

export default Items;
