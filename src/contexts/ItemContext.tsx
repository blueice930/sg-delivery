import React, {
  useContext, useState, useEffect, createContext, useCallback,
} from 'react';
import { Severity } from 'src/components/AlertMsg';
import Loading from 'src/components/Loading';
import { createItem, getItems } from 'src/firebase';
import { Item } from 'src/types/item';

const ItemContext = createContext<any>({});

export const useItems = () => useContext(ItemContext);

export const ItemsProvider = ({ children } : any) => {
  const [items, setItems] = useState<Item[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<any>({});
  const [severity, setSeverity] = useState<Severity>(Severity.ERROR);

  const getItemWithPagination = useCallback(async (cursorId: string) => {
    const { data } = await getItems({ cursorId });
    const { data: { items: newBatch } } = data;
    const allItems = [...items, ...newBatch];
    setItems(allItems);
  }, [items]);

  const addItem = useCallback(async ({
    deliveryCompany,
    packageId,
    itemName,
    itemQuantity,
    comments,
  }: {
    deliveryCompany: string,
    packageId: string,
    itemName: string,
    itemQuantity: string,
    comments: string,
  }) => {
    setAlert({});
    const { data } = await createItem({
      deliveryCompany,
      packageId,
      itemName,
      itemQuantity,
      comments,
    });
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
  }, [items]);

  useEffect(() => {
    const getItemsFnCall = async () => {
      try {
        const { data } = await getItems();
        if (!data?.success) {
          setSeverity(Severity.ERROR);
          setAlert({ title: 'fetch-failed', message: 'Something wrong with the network', details: 'Get items failed' });
        }
        const { data: { items: itemsData, totalCount: totalCountData } } = data;
        setItems(itemsData);
        setTotalCount(totalCountData);
        setAlert({ title: 'fetch-failed', message: 'Something wrong with the network', details: 'Get items failed' });
        setLoading(false);
      } catch (e) {
        setSeverity(Severity.ERROR);
        setAlert({
          title: e?.code,
          message: e?.message,
          details: e?.details,
        });
        setLoading(false);
      }
    };
    getItemsFnCall();
  }, []);

  const value = {
    items,
    alert,
    severity,
    totalCount,
    getItemWithPagination,
    addItem,
  };

  return (
    <ItemContext.Provider value={value}>
      {loading ? <Loading /> : children}
    </ItemContext.Provider>
  );
};
