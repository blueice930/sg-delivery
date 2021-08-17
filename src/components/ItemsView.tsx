import { DataGrid, GridColDef } from '@material-ui/data-grid';
import React, { useCallback, useState } from 'react';
import firebaseApp from 'firebase/app';
import styled from 'styled-components';
import jstz from 'jstz';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { useItems } from 'src/contexts/ItemContext';
import AlertMsg, { Severity } from 'src/components/AlertMsg';
import { Item } from 'src/types/item';
import { Typography } from '@material-ui/core';

dayjs.extend(utc);
dayjs.extend(timezone);

const Container = styled.div`
`;

const DEFAULT_PAGE_SIZE: number = 10;

const ItemsView = () => {
  const {
    items, alert, severity, totalCount, getItemWithPagination,
  } = useItems();
  const [currPage, setCurrPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const rows = items.map(({
    packageId,
    deliveryCompany,
    status,
    itemName,
    itemQuantity,
    createdAt,
  }: Item, index: number) => ({
    id: index,
    packageId,
    deliveryCompany,
    status,
    itemName,
    itemQuantity,
    createdAt,
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: ' ', width: 20 },
    {
      field: 'packageId',
      headerName: 'Package Number',
      description: 'Package Number',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'deliveryCompany',
      headerName: 'Delivery Company',
      description: 'Delivery Company',
      minWidth: 200,
      flex: 0.8,
    },
    {
      field: 'itemName',
      headerName: 'Name',
      description: 'Item Name',
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: 'itemQuantity',
      headerName: 'Quantity',
      description: 'Item Quantity',
      type: 'number',
      minWidth: 140,
    },
    {
      field: 'status',
      headerName: 'Status',
      description: 'Package Status',
      valueFormatter: (param) => {
        const status = param.value?.toString().replaceAll('_', ' ') || '';
        const valueFormatted = status?.charAt(0) + status.slice(1).toLowerCase();
        return valueFormatted;
      },
      minWidth: 130,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      description: 'Date Create',
      valueFormatter: (param) => {
        const millis = param.value;
        const tz = jstz.determine();
        const date = dayjs(Number(millis)).tz(tz.name()).toString();
        return date;
      },
      minWidth: 250,
      flex: 1,
    },
  ];

  const handleNextPage = useCallback(async () => {
    const cursor = items[items.length - 1]?.uid || '';
    await getItemWithPagination(cursor);
  }, [items]);

  const handlePageOnChange = useCallback(async (page: number) => {
    const tempCurrPage = currPage;
    setCurrPage(page);
    if (page * pageSize >= items.length) {
      await handleNextPage();
    }
    // TODO
    // if (page < tempCurrPage) {}
  },
  [currPage, items, pageSize]);

  return (
    <Container>
      <Typography variant="h4" color="textPrimary" align="center">
        Active Items
      </Typography>
      <AlertMsg alertMsg={alert} severity={severity} />
      <DataGrid
        autoHeight
        sortingMode="server"
        rowCount={totalCount}
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(pSize: number) => { setPageSize(pSize); }}
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE, 25, 50]}
        checkboxSelection
        disableColumnFilter
        onPageChange={handlePageOnChange}
      />
    </Container>
  );
};

export default ItemsView;
