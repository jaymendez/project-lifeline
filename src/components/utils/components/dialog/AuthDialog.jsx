import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  OutlinedInput,
  FormHelperText,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { RepositoryFactory } from "../../../../api/repositories/RepositoryFactory";

const Auth = RepositoryFactory.get("auth");

const DEFAULT_PASSWORD = "admin";

export default function AuthDialog() {
  const history = useHistory();
  const [open, setOpen] = React.useState(true);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    // setOpen(false);
    history.go(0);
  };

  const validatePassword = async (e) => {
    e.preventDefault();
    const res = await Auth.validatePassword({ password });
    if (res.status === 200) {
      const auth = res.data.checkpassword[0].access;
      if (auth === "granted") {
        setOpen(false);
      } else {
        setErrors({ password: "Wrong Password" });
      }
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Authorized Access</DialogTitle>
        <form onSubmit={validatePassword}>
          <DialogContent>
            <FormControl variant="outlined" style={{ width: 400 }}>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                error={errors?.password ? true : false}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={toggleShowPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
              <FormHelperText>
                <Typography variant="body1" style={{ color: "red" }}>
                  {errors?.password || ""}
                </Typography>
              </FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleClose} color="primary">
              Cancel
            </Button> */}
            <Button onClick={validatePassword} color="primary" type="submit">
              Login
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
