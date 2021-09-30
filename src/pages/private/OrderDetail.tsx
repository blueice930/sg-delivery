import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

import { Order } from 'src/types/order';
import { getOrderByUid as getOrderByUidAPICall, getItemsByUids as getItemsByUidsAPICall, payOrderByAlipay } from 'src/firebase';
import { useOrders } from 'src/contexts/OrderContext';
import { themeColor } from 'src/theme';
import PageNotFound from 'src/pages/404';
import Loading from 'src/components/Loading';
import { useItems } from 'src/contexts/ItemContext';
import { Item } from 'src/types/item';

const StyledContainer = styled.div`
  max-width: 800px;
  margin: 5px auto;
  border: 1px solid ${themeColor.dark};

  h3 {
    margin: 20px 0;
    color: white;
    background-color: ${themeColor.dark};
    padding: 10px 30px;
    border-radius: 4px;;
  }

  .detail-container {
    display: flex;
    align-items: center;
    justify-content: left;
  }

  .label {
    font-weight: bold;
    padding: 40px;
  }
  .text {
    padding: 40px;
  }

  .items-container {
    border: 1px solid ${themeColor.atomBlue};
    border-radius: 4px;
    margin: 20px;
  }
`;

const OrderDetail = () => {
  const { orders } = useOrders();
  const { items } = useItems();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentOrder, setCurrentOrder] = useState<null | Order>(null);
  const [orderItems, setOrderItems] = useState<Item[]>([]);
  const [testurl, setTesturl] = useState<string>('');
  const params: any = useParams();

  const getOrderByUid = useCallback(async (orderUid: string) => {
    const cacheOrder = orders.find((order: Order) => order?.uid === orderUid);
    if (isEmpty(cacheOrder)) {
      try {
        const { data } = await getOrderByUidAPICall({ orderUid });
        if (data?.success) {
          return data?.data;
        }
      } catch (e: any) {
        console.error(e);
      }
      return null;
    }
    return cacheOrder;
  }, [orders]);

  const fetchOrderItems = useCallback(async (itemUids: string[]) => {
    console.log('items', items);
    const cachedItems: Item[] = [];
    const uncachedUids: string[] = [];
    itemUids.forEach((uid) => {
      const cache = items.find((i: Item) => i.uid === uid);
      if (cache) {
        cachedItems.push(cache);
      } else {
        uncachedUids.push(uid);
      }
    });
    try {
      const { data } = await getItemsByUidsAPICall({ itemUids: uncachedUids });
      if (!data?.success) {
        throw new Error('Get Items Unsuccessfully ');
      }
      const uncachedItems = data?.data || [];
      return [...cachedItems, ...uncachedItems];
    } catch (e: any) {
      console.warn(e);
      return [...cachedItems];
    }
  }, [items]);

  const fetchOrderDetail = useCallback(async () => {
    const orderUid = params?.uid;
    const order = await getOrderByUid(orderUid);
    const itemUids = order?.itemUids;
    if (itemUids?.length) {
      // fetch cache
      const result = await fetchOrderItems(itemUids) || [];
      setOrderItems(result);
    }
    setCurrentOrder(order);
    setIsLoading(false);
  }, [params]);

  useEffect(() => {
    fetchOrderDetail();
  }, [items]);

  const testPayment = async () => {
    try {
      const { data } = await payOrderByAlipay({ orderUid: currentOrder?.uid });
      console.log('data', data);
      if (data) {
        setTesturl(data);
        window.open(data, '_blank')?.focus();
      }
    } catch (e) {
      console.log('e', e);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && isEmpty(currentOrder) && <PageNotFound />}
      {!isLoading && !isEmpty(currentOrder) && (
        <StyledContainer>
          <h3>Order Detail</h3>
          <div className="detail-container">
            <div className="label">Order ID</div>
            <div className="text">{currentOrder?.uid || ''}</div>
          </div>
          <div className="detail-container">
            <div className="label">Total Price</div>
            <div className="text">{currentOrder?.price || ''}</div>
          </div>
          <div className="detail-container">
            <div className="label">Create Date</div>
            <div className="text">{currentOrder?.createdAt || ''}</div>
          </div>
          <div className="detail-container">
            <div className="label">Update Date</div>
            <div className="text">{currentOrder?.updatedAt || ''}</div>
          </div>
          <div className="detail-container">
            <div className="label">Status</div>
            <div className="text">{currentOrder?.status || ''}</div>
          </div>
          <div>
            <div className="label">Items</div>
            {orderItems.map((item) => (
              <div className="items-container">
                <div className="detail-container">
                  <div className="label">Item Name</div>
                  <div className="text">{item.itemName || ''}</div>
                </div>
                <div className="detail-container">
                  <div className="label">Package ID</div>
                  <div className="text">{item.packageId || ''}</div>
                </div>
                <div className="detail-container">
                  <div className="label">Delivery Price</div>
                  <div className="text">{item.deliveryPrice || ''}</div>
                </div>
                <div className="detail-container">
                  <div className="label">Item Status</div>
                  <div className="text">{item.status || ''}</div>
                </div>
                <div className="detail-container">
                  <div className="label">Item Quantity</div>
                  <div className="text">{item.itemQuantity || ''}</div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={testPayment}>Pay Now</Button>
          <a href={testurl} target="_blank" rel="noreferrer">{testurl}</a>
        </StyledContainer>
      )}
    </>
  );
};

export default OrderDetail;
