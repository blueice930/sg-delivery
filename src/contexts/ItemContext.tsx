import React, {
  useContext, useState, useEffect, createContext, useCallback, useMemo,
} from 'react';
import { Severity } from 'src/components/AlertMsg';
import Loading from 'src/components/Loading';
import { createItem, getActiveItems } from 'src/firebase';
import { Item, ItemStatus, LiveItemStatus } from 'src/types/item';

const ItemContext = createContext<any>({});

export const useItems = () => useContext(ItemContext);

export const ItemsProvider = ({ children } : any) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemUids, setSelectedItemUids] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<any>({});
  const [severity, setSeverity] = useState<Severity>(Severity.ERROR);

  const createdItems = useMemo(() => (
    items.filter((i) => i.status === ItemStatus.CREATED)
  ), [items]);

  const inWarehouseItems = useMemo(() => (
    items.filter((i) => i.status === ItemStatus.ARRIVED_WAREHOUSE)
  ), [items]);

  const activeItems = useMemo(() => (
    items.filter((i) => LiveItemStatus.includes(i.status))
  ), [items]);

  const getItemWithPagination = useCallback(async (cursorId: string) => {
    const { data } = await getActiveItems({ cursorId });
    const { data: { items: newBatch } } = data;
    const allItems = [...items, ...newBatch];
    setItems(allItems);
  }, [items]);

  const addItem = useCallback(async ({
    deliveryCompany,
    packageId,
    itemName,
    itemQuantity,
    itemPrice,
    comments,
  }: {
    deliveryCompany: string,
    packageId: string,
    itemName: string,
    itemQuantity: number,
    itemPrice: number,
    comments: string,
  }) => {
    setAlert({});
    const { data } = await createItem({
      deliveryCompany,
      packageId,
      itemName,
      itemQuantity,
      itemPrice,
      comments,
    });
    // TODO: if not success?
    if (data?.success) {
      const item: Item = data?.data;
      setItems([...items, item]);
      setSeverity(Severity.SUCCESS);
      setAlert({
        title: 'Success',
        message: 'Item Added successfully!',
        details: '🎉',
      });
    }
  }, [items, alert, severity]);

  useEffect(() => {
    const getActiveItemsFnCall = async () => {
      try {
        // TODO: NOT PAGINATED ON FIRST FETCH.
        const { data } = await getActiveItems();
        if (!data?.success) {
          setSeverity(Severity.ERROR);
          setAlert({ title: 'fetch-failed', message: 'Something wrong with the network', details: 'Get items failed' });
        }
        const { data: { items: itemsData, totalCount: totalCountData } } = data;
        setItems(itemsData);
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
    getActiveItemsFnCall();
  }, []);

  const value = {
    items,
    createdItems,
    activeItems,
    inWarehouseItems,
    alert,
    severity,
    totalCount,
    getItemWithPagination,
    addItem,
    selectedItemUids,
    setSelectedItemUids,
  };

  return (
    <ItemContext.Provider value={value}>
      {loading ? <Loading /> : children}
    </ItemContext.Provider>
  );
};
