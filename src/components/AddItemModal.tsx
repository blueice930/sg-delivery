import React, {
  useCallback, useRef, useState,
} from 'react';
import {
  Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Grid, makeStyles, Modal, Paper, TextField, Theme,
} from '@material-ui/core';
import { toNumber } from 'lodash';

import { useItems } from 'src/contexts/ItemContext';
import AlertMsg, { Severity } from 'src/components/AlertMsg';

const useStyles = makeStyles((muiTheme: Theme) => ({
  root: {},
  form: {
    padding: muiTheme.spacing(10),
    marginTop: muiTheme.spacing(8),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {

  },
}));

const AddItemModal = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<any>({});
  const [severity, setSeverity] = useState<Severity>(Severity.ERROR);
  const { addItem } = useItems();

  const companyRef = useRef<HTMLInputElement>(null);
  const packageIdRef = useRef<HTMLInputElement>(null);
  const itemNameRef = useRef<HTMLInputElement>(null);
  const itemQuantityRef = useRef<HTMLInputElement>(null);
  const itemPriceRef = useRef<HTMLInputElement>(null);
  const commentsRef = useRef<HTMLInputElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAlert({});
  };

  const handleAddItem = useCallback(async () => {
    setIsSaving(true);
    setAlert({});
    const deliveryCompany = companyRef?.current?.value;
    const packageId = packageIdRef?.current?.value;
    const itemName = itemNameRef?.current?.value;
    const itemQuantity = toNumber(itemQuantityRef?.current?.value);
    const itemPrice = toNumber(itemPriceRef?.current?.value);
    const comments = commentsRef?.current?.value;

    try {
      await addItem({
        deliveryCompany,
        packageId,
        itemName,
        itemQuantity,
        itemPrice,
        comments,
      });
      setIsSaving(false);
      setOpen(false);
    } catch (e: any) {
      setIsSaving(false);
      setSeverity(Severity.ERROR);
      setAlert({
        title: e?.code,
        message: e?.message,
        details: e?.details,
      });
    }
  }, [alert]);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Package
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Add Package
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add Package, please make sure you have a Package Delivery Number.
          </DialogContentText>
          <AlertMsg alertMsg={alert} severity={severity} />
          <Modal
            open={isSaving}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className={classes.loading}
          >
            <CircularProgress size={50} color="secondary" />
          </Modal>
          <Paper
            className={classes.form}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addBtnRef.current?.click();
              }
            }}
          >
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="itemName"
                  label="Item Name"
                  type="text"
                  fullWidth
                  inputRef={itemNameRef}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="itemQuantity"
                  label="Item Quantity"
                  type="number"
                  fullWidth
                  inputRef={itemQuantityRef}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="itemPrice"
                  label="Item Price"
                  type="number"
                  fullWidth
                  inputRef={itemPriceRef}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="packageId"
                  label="Package Number:"
                  type="text"
                  fullWidth
                  inputRef={packageIdRef}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="deliveryCompany"
                  label="Delivery Company"
                  type="text"
                  fullWidth
                  inputRef={companyRef}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Comments"
                  type="text"
                  fullWidth
                  inputRef={commentsRef}
                />
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddItem}
            variant="contained"
            color="primary"
            ref={addBtnRef}
            disabled={isSaving}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddItemModal;
