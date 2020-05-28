import React, { useState  } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

const DEFAULT_PASSWORD = "admin";

export default function AuthDialog() {
  const [open, setOpen] = React.useState(true);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    // setOpen(false);
    window.location = "/home";
  };

  const processPassword = () => {
    if (password === DEFAULT_PASSWORD) {
      setOpen(false);
    } else {
      setErrors({password: "Wrong Password"});
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Authenticate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            AUTHENTICATE USER BEFORE ACCESSING THIS PAGE
          </DialogContentText>
          <TextField
            error={errors?.password ? true : false}
            helperText={errors?.password || ""}
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="password"
            fullWidth
            onChange={e => setPassword(e.target.value)}
          />
          {/* <Typography variant="body1" style={{color: "red"}}>{errors?.password || ""}</Typography>  */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={processPassword} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
