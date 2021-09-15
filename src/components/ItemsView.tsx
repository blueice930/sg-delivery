import { DataGrid, GridColDef } from '@material-ui/data-grid';
import React, { useCallback, useState } from 'react';
import firebaseApp from 'firebase/app';
import styled from 'styled-components';
import jstz from 'jstz';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { useItems } from 'src/contexts/ItemContext';
import { Item } from 'src/types/item';
import {
  makeStyles, Paper, Theme, Typography,
} from '@material-ui/core';

dayjs.extend(utc);
dayjs.extend(timezone);

const useStyles = makeStyles((muiTheme: Theme) => ({
  root: {
    margin: muiTheme.spacing(1),
    padding: muiTheme.spacing(2),
  },
}));

const DEFAULT_PAGE_SIZE: number = 10;

const ItemsView = () => {
  const {
    items, totalCount, getItemWithPagination, setSelectedItemUids,
  } = useItems();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const classes = useStyles();

  const rows = items.map(({
    uid,
    packageId,
    deliveryCompany,
    status,
    itemName,
    itemQuantity,
    deliveryPrice,
    createdAt,
  }: Item, index: number) => ({
    uid,
    id: index + 1,
    packageId,
    deliveryCompany,
    status,
    itemName,
    itemQuantity,
    deliveryPrice,
    createdAt,
  }));

  const columns: GridColDef[] = [
    { field: 'uid', headerName: ' ', hide: true },
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
      minWidth: 140,
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
      field: 'deliveryPrice',
      headerName: 'Price',
      description: 'Item Delivery Price',
      type: 'number',
      minWidth: 140,
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
    if (page * pageSize >= items.length) {
      await handleNextPage();
    }
    // TODO
    // if (page < tempCurrPage) {}
  },
  [items, pageSize]);

  return (
    <Paper className={classes.root}>
      <Typography variant="h4" color="textPrimary" align="center">
        Active Items
      </Typography>
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
        onSelectionModelChange={(ids) => {
          setSelectedItemUids(ids.map((id: any) => (items[id - 1]?.uid) || []));
        }}
      />
    </Paper>
  );
};

export default ItemsView;
