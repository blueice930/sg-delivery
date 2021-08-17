import React, {
  useContext, useState, useEffect, createContext, useCallback,
} from 'react';
import Loading from 'src/components/Loading';
import { createItem, getItems } from 'src/firebase';
import { Item } from 'src/types/item';

const ItemContext = createContext<any>({});

export const useItems = () => useContext(ItemContext);

export const ItemsProvider = ({ children } : any) => {
  const [items, setItems] = useState<Item[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>({});

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
    }
  }, [items]);

  useEffect(() => {
    const getItemsFnCall = async () => {
      try {
        const { data } = await getItems();
        if (!data?.success) {
          setError({ code: 'fetch-failed', message: 'Something wrong with the network' });
        }
        const { data: { items: itemsData, totalCount: totalCountData } } = data;
        setItems(itemsData);
        setTotalCount(totalCountData);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };
    getItemsFnCall();
  }, []);

  const value = {
    items,
    error,
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
