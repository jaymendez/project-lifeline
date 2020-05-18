import React, { useState } from "react";
import { CircularProgress, Button, Backdrop } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Progress = (props) => {
  const classes = useStyles();
  const { open } = props;
  return (
    <>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Progress;
