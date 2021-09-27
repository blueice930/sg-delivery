import React from 'react';
import { useParams } from 'react-router-dom';

const ItemDetailView = () => {
  const items = { abc: 123 };
  const params: any = useParams();
  return (
    <div>
      ItemDetial View
      {params?.id}
    </div>
  );
};

export default ItemDetailView;
