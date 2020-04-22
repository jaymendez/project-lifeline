import React from "react";
import {
  Grid,
  Paper,
  Typography,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableBody,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import Chart from "./RTChart";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: "center",
    // color: theme.palette.text.secondary,
    color: "white",
    backgroundColor: "#222222",
  },
  table: {
    minWidth: 650,
  },
  bordered: {
    border: "solid 2px white",
  },
}));

const TelemetryCard = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Grid container className={classes.bordered}>
        <Grid item xs={4} align="left">
          <Typography variant="h5">DELA CRUZ, JUAN F.</Typography>
        </Grid>
        <Grid item xs={5} />
        <Grid item xs={3} align="right">
          <Typography variant="subtitle2">Stable or No co-morbid</Typography>
          <Typography variant="subtitle2">Bed No. #</Typography>
        </Grid>
      </Grid>
      <Grid container>
        {/* ECG Row */}
        <Grid item xs={8} style={{ height: "100px" }}>
          <Chart />
        </Grid>
        <Grid item xs={2}>
          <Typography align="left" variant="subtitle2">
            ECG (BPM)
          </Typography>
          <Typography align="right" variant="h2">
            67
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography align="left" variant="subtitle2">
            NIBP @8:15 mmhg
          </Typography>
          <Typography align="right" variant="h3">
            110/70
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        {/* SpO Row */}
        <Grid item xs={8} style={{ height: "100px" }}>
          <Chart />
        </Grid>
        <Grid item xs={2}>
          <Typography align="left" variant="subtitle2">
            SpO2 (%)
          </Typography>
          <Typography align="right" variant="h2">
            98
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography align="left" variant="subtitle2">
            TEMP C
          </Typography>
          <Typography align="right" variant="h2">
            37.1
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        {/* RESP Row */}
        <Grid item xs={8} style={{ height: "100px" }}>
          <Chart />
        </Grid>
        <Grid item xs={2}>
          <Typography align="left" variant="subtitle2">
            RESP (RPM)
          </Typography>
          <Typography align="right" variant="h2">
            28
          </Typography>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </Paper>
  );
};

export default TelemetryCard;
