import React, { useEffect, useState }from "react";
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
import { makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from "@material-ui/core/styles";
import _ from "lodash";
import clsx from "clsx";
import Chart from "./RTChart";

let theme = createMuiTheme({
  // typography: {
  //   h2: {
  //     fontSize: '3rem',
  //     '@media (min-width:600px)': {
  //       fontSize: '3.75rem',
  //     },
  //   }
  // },
});
theme = responsiveFontSizes(theme);

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
    borderBottom: "solid 2px white",
  },
  ecg: {
    color: "#76db3d"
  },
  spo2: {
    color: "#17eaf1"
  },
  resp: {
    color: "#f6f830"
  },
  TelemetryCard: {
    border: "2px solid white"
  }
}));

const TelemetryCard = () => {
  const classes = useStyles();
  const [chartHeight] = useState("80px");
  return (
    <ThemeProvider theme={theme}>
    <Paper className={clsx(classes.paper, classes.TelemetryCard)}>
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
      {/* ECG Row */}
      <Grid container style={{ height: chartHeight }}>
        <Grid item xs={8}>
          {/* <Chart height={chartHeight} /> */}
        </Grid>
        <Grid item xs={2} className={classes.ecg}>
          <Typography align="left" variant="subtitle2">
            ECG (BPM)
          </Typography>
          <Typography align="right" variant="h2">
            67
          </Typography>
        </Grid>
        <Grid item xs={2} className={classes.spo2}>
          <Typography align="right" variant="subtitle2">
            PR
          </Typography>
          <Typography align="right" variant="h3">
            65
          </Typography>
        </Grid>
      </Grid>
      {/* SpO Row */}
      <Grid container style={{ height: chartHeight }}>
        <Grid item xs={8}>
          {/* <Chart height={chartHeight} /> */}
        </Grid>
        <Grid item xs={2} className={classes.spo2}>
          <Typography align="left" variant="subtitle2">
            SpO2 (%)
          </Typography>
          <Typography align="right" variant="h2">
            98
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
      {/* RESP Row */}
      <Grid container style={{ height: chartHeight }}>
        <Grid item xs={8} >
          {/* <Chart height={chartHeight} /> */}
        </Grid>
        <Grid item xs={2}  className={classes.resp}>
          <Typography align="left" variant="subtitle2">
            RESP (RPM)
          </Typography>
          <Typography align="right" variant="h2">
            28
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography align="left" variant="subtitle2">
            TEMP C
          </Typography>
          <Typography align="right" variant="h3">
            37.1
          </Typography>
        </Grid>
      </Grid>
    </Paper>
    </ThemeProvider>
  );
};

export default TelemetryCard;
