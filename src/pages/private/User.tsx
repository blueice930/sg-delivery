import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useAuth } from 'src/contexts/AuthContext';
import {
  CircularProgress, Grid, makeStyles, Paper,
  TextField, Theme, Typography,
} from '@material-ui/core';
import { themeColor } from 'src/theme';

const useStyles = makeStyles((muiTheme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  paper: {
    marginTop: muiTheme.spacing(3),
    marginBottom: muiTheme.spacing(3),
    padding: muiTheme.spacing(2),
    [muiTheme.breakpoints.up(600 + muiTheme.spacing(3) * 2)]: {
      marginTop: muiTheme.spacing(6),
      marginBottom: muiTheme.spacing(6),
      padding: muiTheme.spacing(3),
    },
    maxWidth: '500px',
  },
  storageAddress: {
    width: '500px',
  },
  loading: {
    marginLeft: '5px',
  },
  btnGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const User = () => {
  const [error, setError] = useState('');
  const [isViewing, setIsViewing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const {
    currUser, logout, updateUserInfo, storageAddr,
  } = useAuth();
  const userStorageAddr = `${storageAddr}-${currUser?.id?.slice(0, 6)}`;
  const history = useHistory();
  const classes = useStyles();

  const fnameRef = useRef<HTMLInputElement>(null);
  const lnameRef = useRef<HTMLInputElement>(null);
  const fullnameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      history.push('/login');
    } catch {
      setError('Failed to log out');
    }
  };

  const handleOnClick = async () => {
    if (!isViewing) {
      const fname = fnameRef?.current?.value;
      const lname = lnameRef?.current?.value;
      const fullname = fullnameRef?.current?.value;
      const phone = phoneRef?.current?.value;
      const age = ageRef?.current?.value;
      const address = addressRef?.current?.value;
      const dirtyProps = {
        ...(fname !== currUser.fname) && { fname },
        ...(lname !== currUser.lname) && { lname },
        ...(fullname !== currUser.displayName) && { displayName: fullname },
        ...(phone !== currUser.phone) && { phone },
        ...(age !== currUser.age) && { age },
        ...(address !== currUser.address) && { address },
      };
      if (!isEmpty(dirtyProps)) {
        setIsSaving(true);
        await updateUserInfo(dirtyProps);
        setIsSaving(false);
      }
    }
    setIsViewing(!isViewing);
  };

  return (
    <div className={classes.root}>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper className={clsx(classes.paper, classes.storageAddress)}>
        <Typography variant="h6" gutterBottom>
          Your Personal Shipping Address in China
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={9} sm={9}>
            <TextField
              id="storageAddress"
              name="storageAddress"
              label="Storage Address in China"
              fullWidth
              defaultValue={userStorageAddr}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <CopyToClipboard text={userStorageAddr} onCopy={() => setIsCopied(true)}>
              <Button
                variant="contained"
                className="copy-btn"
                color="primary"
                style={isCopied ? { backgroundColor: themeColor.green } : {}}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </CopyToClipboard>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>
          User Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="firstName"
              name="firstName"
              label="First name"
              fullWidth
              autoComplete="given-name"
              defaultValue={currUser.fname}
              disabled={isViewing || isSaving}
              variant={isViewing ? 'filled' : 'outlined'}
              inputRef={fnameRef}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="lastName"
              name="lastName"
              label="Last name"
              fullWidth
              autoComplete="family-name"
              defaultValue={currUser.lname}
              disabled={isViewing || isSaving}
              variant={isViewing ? 'filled' : 'outlined'}
              inputRef={lnameRef}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="nullName"
              name="nullName"
              label="Full name"
              fullWidth
              autoComplete="full-name"
              defaultValue={currUser.displayName}
              disabled={isViewing || isSaving}
              variant={isViewing ? 'filled' : 'outlined'}
              inputRef={fullnameRef}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="filled"
              fullWidth
              autoComplete="email"
              defaultValue={currUser.email}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="phone"
              name="phone"
              label="Phone"
              fullWidth
              autoComplete="phone"
              defaultValue={currUser.phone}
              disabled={isViewing || isSaving}
              variant={isViewing ? 'filled' : 'outlined'}
              inputRef={phoneRef}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="address"
              name="address"
              label="Your Shipping Address"
              fullWidth
              defaultValue={currUser.address}
              disabled={isViewing || isSaving}
              variant={isViewing ? 'filled' : 'outlined'}
              inputRef={addressRef}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="age"
              name="age"
              label="Age"
              fullWidth
              autoComplete="age"
              type="number"
              defaultValue={currUser.age}
              disabled={isViewing || isSaving}
              variant={isViewing ? 'filled' : 'outlined'}
              inputRef={ageRef}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="balance"
              name="balance"
              label="Balance"
              fullWidth
              autoComplete="shipping postal-code"
              defaultValue={(currUser.wallet?.balance / 100) || 0}
              disabled
              variant="filled"
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid className={classes.btnGroup} item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOnClick}
              disabled={isSaving}
            >
              {isViewing ? 'Edit' : 'Save'}
              { isSaving && <CircularProgress className={classes.loading} size={20} color="secondary" />}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default User;
