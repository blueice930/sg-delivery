import { DataGrid, GridColDef, GridFilterModel } from '@material-ui/data-grid';
import React, { useCallback, useState } from 'react';
import jstz from 'jstz';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
  makeStyles, Paper, Theme, Typography, Switch,
} from '@material-ui/core';

import { useItems } from 'src/contexts/ItemContext';
import { Item, ItemStatus } from 'src/types/item';

dayjs.extend(utc);
dayjs.extend(timezone);

const useStyles = makeStyles((muiTheme: Theme) => ({
  root: {
    margin: muiTheme.spacing(1),
    padding: muiTheme.spacing(2),
  },
  switchGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'normal',
  },
}));

const DEFAULT_PAGE_SIZE: number = 10;
const emptyFilter: GridFilterModel = { items: [] };
const readyItemFilter: GridFilterModel = {
  items: [{
    columnField: 'status', operatorValue: 'equals', value: ItemStatus.ARRIVED_WAREHOUSE,
  }],
};

const ItemsView = () => {
  const {
    activeItems, totalCount, getItemWithPagination, setSelectedItemUids,
  } = useItems();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [useFilter, setUseFilter] = useState(false);

  const classes = useStyles();

  const rows = activeItems.map(({
    uid,
    packageId,
    deliveryCompany,
    status,
    itemName,
    deliveryPrice,
    createdAt,
  }: Item, index: number) => ({
    uid,
    id: index + 1,
    packageId,
    deliveryCompany,
    status,
    itemName,
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
      field: 'status',
      headerName: 'Status',
      description: 'Package Status',
      valueFormatter: (param) => {
        const status = param.value?.toString().replaceAll('_', ' ') || '';
        const valueFormatted = status?.charAt(0) + status.slice(1).toLowerCase();
        return valueFormatted;
      },
      minWidth: 150,
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
    const cursor = activeItems[activeItems.length - 1]?.uid || '';
    await getItemWithPagination(cursor);
  }, [activeItems]);

  const handlePageOnChange = useCallback(async (page: number) => {
    // page start with 0.
    if ((page + 1) * pageSize >= activeItems.length) {
      await handleNextPage();
    }
  },
  [activeItems, pageSize]);

  return (
    <Paper className={classes.root}>
      <Typography variant="h4" color="textPrimary" align="center">
        Active Packages
      </Typography>
      <div className={classes.switchGroup}>
        <Switch checked={useFilter} onChange={() => { setUseFilter(!useFilter); }} color="secondary" />
        <div>Ready Packages</div>
      </div>
      <DataGrid
        autoHeight
        sortingMode="server"
        rowCount={useFilter ? activeItems?.count : totalCount}
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(pSize: number) => { setPageSize(pSize); }}
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE, 25, 50]}
        checkboxSelection
        onPageChange={handlePageOnChange}
        onSelectionModelChange={(ids) => {
          setSelectedItemUids(ids.map((id: any) => (activeItems[id - 1]?.uid) || []));
        }}
        filterModel={useFilter ? readyItemFilter : emptyFilter}
      />
    </Paper>
  );
};

export default ItemsView;
