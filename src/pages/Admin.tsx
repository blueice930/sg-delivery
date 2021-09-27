import React, { useState, useCallback } from 'react';
import {
  Button, CircularProgress,
  Grid, makeStyles, Paper, TextField, Theme, Typography,
} from '@material-ui/core';
import { toNumber } from 'lodash';

import { updateArrivedItem } from 'src/firebase';
import AlertMsg, { Severity } from 'src/components/AlertMsg';

const useStyles = makeStyles((muiTheme: Theme) => ({
  root: {},
  paper: {
    margin: '20px auto',
    padding: muiTheme.spacing(2),
    maxWidth: '600px',
  },
  btnContainer: {
    textAlign: 'right',
  },
  loading: {
    marginLeft: '5px',
  },
}));

const AdminPage = () => {
  const classes = useStyles();
  const [packageId, setPackageId] = useState('');
  const [severity, setSeverity] = useState(Severity.SUCCESS);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alertMsg, setAlertMsg] = useState({});
  const [price, setPrice] = useState(0);

  const handleBtnOnClick = useCallback(async () => {
    setIsUpdating(true);
    if (!(packageId && price)) {
      alert('Please enter Package Id and valid Price');
      return;
    }
    try {
      const { data } = await updateArrivedItem({ packageId, price });
      if (data?.success) {
        setSeverity(Severity.SUCCESS);
        setAlertMsg({
          title: 'Success',
          message: `Updated Item (packageID: ${packageId}), Price: ${price}`,
        });
        setPrice(0);
        setPackageId('');
        setIsUpdating(false);
      }
    } catch (e:any) {
      setSeverity(Severity.ERROR);
      setAlertMsg({
        title: e?.code,
        message: e?.message,
      });
      setIsUpdating(false);
    }
  }, [packageId, price]);

  return (
    <div className={classes.root}>
      <AlertMsg alertMsg={alertMsg} severity={severity} />
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>
          Update Package Info & Price
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <TextField
              id="packageId"
              name="packageId"
              label="Package Id"
              fullWidth
              value={packageId}
              onChange={(e) => setPackageId(e?.target?.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              id="price"
              name="price"
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(toNumber(e?.target?.value))}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={12} className={classes.btnContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBtnOnClick}
              disabled={isUpdating}
            >
              Update
              {isUpdating && <CircularProgress className={classes.loading} size={20} color="secondary" />}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default AdminPage;
