import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";
import _ from "lodash";
import clsx from "clsx";
import moment from "moment";
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
  const [time, setTime] = useState(moment().format("HH:mm"));
  const [chartHeight] = useState("80px");
  const [code] = useState({
    ecg: "76282-3",
    spo2: "59407-7",
    primary_rr: "76270-8",
    secondary_rr: "76171-8",
    temp: "8310-5",
    hr: "76282-3",
    pr: "8889-8",
    bp: "131328",
    systolic_bp: "8480-6",
    diastolic_bp: "8462-4",
    mean_arterial_pressure: "8478-0",
  });
  // const generateFunctions = () => {
  //   for (let [key, value] of Object.entries(code)) {
  //     const arr = key.split("_");
  //     const parsed = arr.reduce((acc, val) => {
  //       const captAcc = acc.charAt(0).toUpperCase() + acc.slice(1);
  //       const captVal = val.charAt(0).toUpperCase() + val.slice(1);
  //       return captAcc + val;
  //     });
  //     const name = `get${parsed}`;
  //   }
  // }
  useEffect(() => {
    setTime(moment().format("HH:mm"));
  }, [rxbox]);

  const getECG = () => {
    // heart rate
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.ecg;
    });
    if (index >= 0) {
      return rxbox[index].tpo_value;
    }
    return null;
  };

  const getBP = () => {
    let index;
    // switch (type) {
    //   case "systolic":
    //     index = _.findIndex(rxbox, function (o) {
    //       return o.tpo_code === code.systolic_bp;
    //     });
    //     break;
    //   case "diastolic":
    //     index = _.findIndex(rxbox, function (o) {
    //       return o.tpo_code === code.diastolic_bp;
    //     });
    //     break;
    //   default:
    //     return null;
    // }
    const systolicIndex = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.systolic_bp;
    });

    const diastolicIndex = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.diastolic_bp;
    });

    const systolicVal = systolicIndex >= 0 ? rxbox[systolicIndex].tpo_value : null;
    const diastolicVal = diastolicIndex >= 0 ? rxbox[diastolicIndex].tpo_value : null;
    if (!_.isEmpty(systolicVal) && !_.isEmpty(diastolicVal)) {
      return `${systolicVal}/${diastolicVal}`;
    }
    // if (index >= 0) {
    //   return rxbox[index].tpo_value;
    // }
    return null;
  };

  // const getHR = () => {
  //   const index = _.findIndex(rxbox, function (o) {
  //     return o.tpo_code === code.hr;
  //   });
  //   if (index >= 0) {
  //     return rxbox[index].tpo_value;
  //   }
  //   return null;

  // };

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
      return o.tpo_code === code.primary_rr;
    });

    const secondaryIndex = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.secondary_rr;
    });

    if (index >= 0) {
      return rxbox[index].tpo_value;
    }
    if (secondaryIndex >= 0) {
      return rxbox[secondaryIndex].tpo_value;
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

  const getPulseRate = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.spo2;
    });
    if (index >= 0) {
      return rxbox[index].tpo_value;
    }
    return null;
  };

  const getMAP = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.mean_arterial_pressure;
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
          <Grid
            item
            xs={2}
            className={classes.ecg}
            style={getECG() ? {} : { margin: "auto", color: "#a9a99d" }}
          >
            {getECG() ? (
              <>
                <Grid container>
                  <Grid item xs={6} align="left">
                    <Typography align="left" variant="subtitle2" display="initial">
                      ECG (BPM)
                    </Typography>
                  </Grid>
                  <Grid item xs={6} align="right">
                    <Typography align="right" variant="caption" display="initial">
                      HR
                      <span aria-label="heart-emoji" role="img">
                        ❤️
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
                <Typography align="right" variant="h2">
                  {getECG() || "--"}
                </Typography>
              </>
            ) : (
              <Typography align="center" variant="h5">
                NO DATA
              </Typography>
            )}
            {/* <Typography align="left" variant="subtitle2">
              ECG (BPM)
            </Typography>
            <Typography align="right" variant="h2">
              {getECG() || "67"}
            </Typography> */}
          </Grid>
          <Grid
            item
            xs={2}
            className={classes.spo2}
            style={getPulseRate() ? {} : { margin: "auto", color: "#a9a99d" }}
          >
            {getPulseRate() ? (
              <>
                <Typography align="right" variant="subtitle2">
                  PR
                </Typography>
                <Typography align="right" variant="h3">
                  {getPulseRate() || "43"}
                </Typography>
              </>
            ) : (
              <Typography align="center" variant="h5">
                NO DATA
              </Typography>
            )}
            {/* <Typography align="right" variant="subtitle2">
              PR
            </Typography>
            <Typography align="right" variant="h3">
              {getPulseRate() || "43"}
            </Typography> */}
          </Grid>
        </Grid>
        {/* SpO Row */}
        <Grid container style={{ height: chartHeight }}>
          <Grid item xs={8}>
            {/* <Chart height={chartHeight} /> */}
          </Grid>
          <Grid
            item
            xs={2}
            className={classes.spo2}
            style={getSpo2() ? {} : { margin: "auto", color: "#a9a99d" }}
          >
            {getSpo2() ? (
              <>
                <Typography align="left" variant="subtitle2">
                  SpO
                  <sub>2</sub>
                  (%)
                </Typography>
                <Typography align="right" variant="h2">
                  {getSpo2()}
                </Typography>
              </>
            ) : (
              <Typography align="center" variant="h5">
                NO DATA
              </Typography>
            )}
            {/* <Typography align="left" variant="subtitle2">
              SpO<sub>2</sub> (%)
            </Typography>
            <Typography align="right" variant="h2">
              {getSpo2() || "98"}
            </Typography> */}
          </Grid>
          <Grid item xs={2} style={getMAP() && getBP() ? {} : { margin: "auto", color: "#a9a99d" }}>
            {getMAP() && getBP() ? (
              <>
                <Grid container>
                  <Grid item align="left" xs={6}>
                    <Typography align="left" variant="caption">
                      NIBP @{time}
                      <Typography variant="caption" style={{ display: "block" }}>
                        {" "}
                        mmhg
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item align="right" xs={6}>
                    <Typography align="right" variant="caption">
                      MAP{" "}
                      <Typography variant="caption" style={{ display: "block" }}>
                        {getMAP() || "--"}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
                <Typography
                  align={getBP() ? "right" : "center"}
                  variant={getBP() ? "h4" : "h5"}
                  style={getBP() ? {} : { color: "#a9a99d" }}
                >
                  {getBP() || "No Data"}
                </Typography>
              </>
            ) : (
              <Typography align="center" variant="h5">
                NO DATA
              </Typography>
            )}
            {/* <Grid container>
              <Grid item align="left" xs={6}>
                <Typography align="left" variant="caption">
                  NIBP @8:15
                  <Typography variant="caption" style={{ display: "block" }}>
                    {" "}
                    mmhg
                  </Typography>
                </Typography>
              </Grid>
              <Grid item align="right" xs={6}>
                <Typography align="right" variant="caption">
                  MAP{" "}
                  <Typography variant="caption" style={{ display: "block" }}>
                    {getMAP() || "--"}
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
            <Typography
              align={getBP() ? "right" : "center"}
              variant={getBP() ? "h4" : "h5"}
              style={getBP() ? {} : { color: "#a9a99d" }}
            >
              {getBP() || "No Data"}
            </Typography> */}
          </Grid>
        </Grid>
        {/* RESP Row */}
        <Grid container style={{ height: chartHeight }}>
          <Grid item xs={8}>
            {/* <Chart height={chartHeight} /> */}
          </Grid>
          <Grid
            item
            xs={2}
            className={classes.resp}
            style={getRR() ? {} : { margin: "auto", color: "#a9a99d" }}
          >
            {getRR() ? (
              <>
                <Typography align="left" variant="subtitle2">
                  RESP (RPM)
                </Typography>
                <Typography align="right" variant="h2">
                  {getRR()}
                </Typography>
              </>
            ) : (
              <Typography align="center" variant="h5">
                NO DATA
              </Typography>
            )}
            {/* <Typography align="left" variant="subtitle2">
              RESP (RPM)
            </Typography>
            <Typography align="right" variant="h2">
              {getRR() || "30"}
            </Typography> */}
          </Grid>

          <Grid item xs={2} style={getTemp() ? {} : { margin: "auto", color: "#a9a99d" }}>
            {getTemp() ? (
              <>
                <Typography align="left" variant="subtitle2">
                  TEMP C
                </Typography>
                <Typography align="right" variant="h3">
                  {getTemp()}
                </Typography>
              </>
            ) : (
              <Typography align="center" variant="h5">
                NO DATA
              </Typography>
            )}
            {/* <Typography align="left" variant="subtitle2">
              TEMP C
            </Typography>
            <Typography align="right" variant="h3">
              {getTemp()}
            </Typography> */}
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
};

export default TelemetryCard;
