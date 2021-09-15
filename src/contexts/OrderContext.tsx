import React, {
  useContext, useState, useEffect, createContext, useCallback,
} from 'react';
import { Severity } from 'src/components/AlertMsg';
import Loading from 'src/components/Loading';
import { Order } from 'src/types/order';
import { createOrder as createOrderAPICall } from 'src/firebase';
import { Item, ItemStatus } from 'src/types/item';
import { useItems } from './ItemContext';

const OrderContext = createContext<any>({});

export const useOrders = () => useContext(OrderContext);

export const OrdersProvider = ({ children } : any) => {
  const [severity, setSeverity] = useState<Severity>(Severity.ERROR);
  const [alert, setAlert] = useState<any>({});
  const [totalCount, setTotalCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const { activeItems, selectedItemUids } = useItems();

  const getOrderWithPagination = useCallback(async () => {

  }, [orders]);

  const createOrder = useCallback(async () => {
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
      return;
    }
    try {
      const { data } = await createOrderAPICall({ itemUids: selectedItemUids });
      // TODO: if not success?
      if (true) {
        setSeverity(Severity.SUCCESS);
        setAlert({
          title: 'Success',
          message: 'Order Created successfully!',
          details: '🎉',
        });
      }
    } catch (e: any) {
      setSeverity(Severity.ERROR);
      setAlert({
        title: e?.code,
        message: e?.message,
        details: e?.details,
      });
      console.error(e);
    }
  }, [selectedItemUids, activeItems]);

  const value = {
    orders,
    alert,
    severity,
    totalCount,
    createOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
