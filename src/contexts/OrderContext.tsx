import React, {
  useContext, useState, useEffect, createContext, useCallback,
} from 'react';
import { Severity } from 'src/components/AlertMsg';
import Loading from 'src/components/Loading';
import { Order } from 'src/types/order';
import {
  createOrder as createOrderAPICall, getOrders,
} from 'src/firebase';
import { Item, ItemStatus } from 'src/types/item';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { useItems } from './ItemContext';

const OrderContext = createContext<any>({});

export const useOrders = () => useContext(OrderContext);

export const OrdersProvider = ({ children } : any) => {
  const [severity, setSeverity] = useState<Severity>(Severity.ERROR);
  const [alert, setAlert] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const { activeItems, selectedItemUids } = useItems();
  const history = useHistory();

  const getOrderWithPagination = useCallback(async (cursorId: string) => {
    const { data } = await getOrders({ cursorId });
    const { data: { orders: newBatch } } = data;
    const allOrders = [...orders, ...newBatch];
    setOrders(allOrders);
  }, [orders]);

  const createOrder = useCallback(async () => {
    setLoading(true);
    if (!selectedItemUids.length) {
      setSeverity(Severity.ERROR);
      setAlert({
        title: 'failed',
        message: 'Empty items',
        details: 'Please select items first.',
      });
      return;
    }
    // Check item status: ARRIVED_WAREHOUSE
    const statuses = activeItems.filter((item: Item) => (
      selectedItemUids.includes(item.uid)
    )).map((item: Item) => item.status);
    const allHasArrivedWarehouse = statuses.every((s: ItemStatus) => (
      s === ItemStatus.ARRIVED_WAREHOUSE
    ));
    if (!allHasArrivedWarehouse) {
      setSeverity(Severity.ERROR);
      setAlert({
        title: 'failed',
        message: 'Invalid items',
        details: 'Please select items that have arrived warehouse.',
      });
      setLoading(false);
      return;
    }
    try {
      const { data: { data, success } } = await createOrderAPICall({ itemUids: selectedItemUids });
      // TODO: if not success?
      if (success) {
        setOrders([...orders, data]);
        setSeverity(Severity.SUCCESS);
        setAlert({
          title: 'Success',
          message: 'Order Created successfully!',
          details: '🎉',
        });
        history.push(`order/${data?.uid}`);
      }
      return;
    } catch (e: any) {
      setSeverity(Severity.ERROR);
      setAlert({
        title: e?.code,
        message: e?.message,
        details: e?.details,
      });
      console.error(e);
    }
    setLoading(false);
  }, [selectedItemUids, activeItems]);

  useEffect(() => {
    const getOrdersFnCall = async () => {
      try {
        const { data } = await getOrders();
        if (!data?.success) {
          setSeverity(Severity.ERROR);
          setAlert({ title: 'fetch-failed', message: 'Something wrong with the network', details: 'Get orders failed' });
        }
        const { data: { orders: ordersData, totalCount: totalCountData } } = data;
        setOrders(ordersData);
        setTotalCount(totalCountData);
        setLoading(false);
      } catch (e: any) {
        setSeverity(Severity.ERROR);
        setAlert({
          title: e?.code,
          message: e?.message,
          details: e?.details,
        });
        setLoading(false);
      }
    };
    getOrdersFnCall();
  }, []);

  const value = {
    orders,
    alert,
    loading,
    severity,
    totalCount,
    createOrder,
    getOrderWithPagination,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
