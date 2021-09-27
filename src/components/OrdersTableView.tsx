import React, { useCallback, useState } from 'react';
import {
  makeStyles, Paper, Theme, Typography, Switch,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import {
  DataGrid, GridColDef, GridFilterModel,
} from '@material-ui/data-grid';
import jstz from 'jstz';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { useOrders } from 'src/contexts/OrderContext';
import { DEFAULT_PAGE_SIZE } from 'src/theme';
import { Order, OrderStatus } from 'src/types/order';

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

const emptyFilter: GridFilterModel = { items: [] };
const getReadyItemFilter = (status: OrderStatus): GridFilterModel => ({
  items: [{
    columnField: 'status', operatorValue: 'equals', value: status,
  }],
});

const OrdersTableView = () => {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [useFilter, setUseFilter] = useState(false);

  const classes = useStyles();
  const history = useHistory();
  const { orders, getOrderWithPagination, loading } = useOrders();

  const rows = orders.map(({
    uid,
    itemUids,
    status,
    createdAt,
    updatedAt,
  }: Order, index: number) => ({
    uid,
    id: index + 1,
    itemsCount: itemUids?.length || 0,
    status,
    createdAt,
    updatedAt,
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: ' ', width: 20 },
    {
      field: 'uid',
      headerName: 'Order ID (View Details)',
      minWidth: 200,
      flex: 2,
      renderCell: (params: any) => (
        // eslint-disable-next-line react/destructuring-assignment
        <Link to={`order/${params?.value}`}>{params?.value}</Link>
      ),
    },
    {
      field: 'itemsCount',
      headerName: 'Items Count',
      description: 'How many packages included in this order',
      minWidth: 110,
      flex: 1,
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
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      description: 'Date Update',
      valueFormatter: (param) => {
        const millis = param.value;
        const tz = jstz.determine();
        const date = dayjs(Number(millis)).tz(tz.name()).toString();
        return date;
      },
      minWidth: 250,
      flex: 1,
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
    const cursor = orders[orders.length - 1]?.uid || '';
    await getOrderWithPagination(cursor);
  }, [orders]);

  const handlePageOnChange = useCallback(async (page: number) => {
    // page start with 0.
    if ((page + 1) * pageSize >= orders.length) {
      await handleNextPage();
    }
  },
  [orders, pageSize]);

  return (
    <Paper className={classes.root}>
      <Typography variant="h4" color="textPrimary" align="center">
        All Orders
      </Typography>
      <div className={classes.switchGroup}>
        <Switch checked={useFilter} onChange={() => { setUseFilter(!useFilter); }} color="secondary" />
        <div>Unpaid Orders</div>
      </div>
      <DataGrid
        autoHeight
        loading={loading}
        hideFooterSelectedRowCount
        // todooooo
        rowCount={useFilter ? orders?.count : orders?.count}
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(pSize: number) => { setPageSize(pSize); }}
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE, 25, 50]}
        onPageChange={handlePageOnChange}
        filterModel={useFilter ? getReadyItemFilter(OrderStatus.UNPAID) : emptyFilter}
      />
    </Paper>
  );
};

export default OrdersTableView;
