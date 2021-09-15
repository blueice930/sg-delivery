import React from 'react';
import {
  Button,
  Grid, makeStyles, Paper, TextField, Theme, Typography,
} from '@material-ui/core';

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
}));

const AdminPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
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
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              id="price"
              name="price"
              label="Price"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} className={classes.btnContainer}>
            <Button
              variant="contained"
              color="primary"
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default AdminPage;
