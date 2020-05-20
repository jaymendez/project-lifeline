import React, { useEffect, useState } from "react";
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
import {
  makeStyles,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";
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
    color: "#76db3d",
  },
  spo2: {
    color: "#17eaf1",
  },
  resp: {
    color: "#f6f830",
  },
  TelemetryCard: {
    border: "2px solid white",
  },
  overflowText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const TelemetryCard = (props) => {
  const { patient, rxbox } = props;
  const classes = useStyles();
  const [chartHeight] = useState("80px");
  const [code] = useState({
    ecg: "1000",
    spo2: "59407-7",
    rr: "76270-8",
    temp: "8310-5",
    hr: "76282-3",
    bp: "131328",
  });

  const getECG = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.ecg;
    });
    if (index >= 0) {
      return rxbox[index].tpo_value;
    }
    return null;

  };

  const getBP = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.bp;
    });
    if (index >= 0) {
      return rxbox[index].tpo_value;
    }
    return null;

  };
  const getHR = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.hr;
    });
    if (index >= 0) {
      return rxbox[index].tpo_value;
    }
    return null;

  };
  const getTemp = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.temp;
    });
    if (index >= 0) {
      return rxbox[index].tpo_value;
    }
    return null;

  };
  const getRR = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.rr;
    });
    if (index >= 0) {
      return rxbox[index].tpo_value;
    }
    return null;

  };
  const getSpo2 = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.spo2;
    });
    if (index >= 0) {
      return rxbox[index].tpo_value;
    }
    return null;

  };

  const getNameDetails = () => {
    const middleInitial = patient.rpi_patientmname[0] ? patient.rpi_patientmname[0] + "." : "";
    const name = `${patient.rpi_patientfname || ""} ${
      patient.rpi_patientlname || ""
    } ${middleInitial}`.toUpperCase();
    return `${name}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper className={clsx(classes.paper, classes.TelemetryCard)}>
        <Grid container className={classes.bordered}>
          <Grid item xs={1}>
            <Typography variant="h5">B#{patient.rpi_bednumber || "--"}</Typography>
          </Grid>
          <Grid item xs={6} align="left">
            <div>
              <Typography display="inline" variant="h5" className={classes.overflowText}>
                {/* {`${patient.rpi_patientfname} ${patient.rpi_patientlname}` || "NO NAME"}{" "} */}
                {getNameDetails()}
              </Typography>
              <Typography display="inline" variant="h5" className={classes.overflowText}>
                {/* {`${patient.rpi_patientfname} ${patient.rpi_patientlname}` || "NO NAME"}{" "} */}
                {`/${patient.rpi_age || "-"} /${patient.rpi_gender[0].toUpperCase()}`}
              </Typography>
            </div>
          </Grid>
          {/* <Grid item xs={2} /> */}
          <Grid item xs={5} align="right" className={classes.overflowText}>
            <Typography variant="h5">{patient.rpi_covid19 || "--"}</Typography>
          </Grid>

          {/* <Grid item xs={3} align="right">
            <Typography variant="subtitle2">{patient.rpi_covid19 || "--"}</Typography>
            <Typography variant="subtitle2">{patient.rpi_bednumber || "--"}</Typography>
          </Grid> */}
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
              {"--" || "--"}
            </Typography>
          </Grid>
          <Grid item xs={2} className={classes.spo2}>
            <Typography align="right" variant="subtitle2">
              PR
            </Typography>
            <Typography align="right" variant="h3">
              {getHR() || "--"}
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
              SpO<sub>2</sub> (%)
            </Typography>
            <Typography align="right" variant="h2">
              {getSpo2() || "--"}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography align="left" variant="subtitle2">
              NIBP @8:15 mmhg
            </Typography>
            <Typography align="right" variant="h3">
              {getBP() || "--"}
            </Typography>
          </Grid>
        </Grid>
        {/* RESP Row */}
        <Grid container style={{ height: chartHeight }}>
          <Grid item xs={8}>
            {/* <Chart height={chartHeight} /> */}
          </Grid>
          <Grid item xs={2} className={classes.resp}>
            <Typography align="left" variant="subtitle2">
              RESP (RPM)
            </Typography>
            <Typography align="right" variant="h2">
              {getRR() || "--"}
            </Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography align="left" variant="subtitle2">
              TEMP C
            </Typography>
            <Typography align="right" variant="h3">
              {getTemp() || "--"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default TelemetryCard;
