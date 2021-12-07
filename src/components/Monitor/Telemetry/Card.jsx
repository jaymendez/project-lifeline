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
import { RepositoryFactory } from "../../../api/repositories/RepositoryFactory";
import moment from "moment";
import Chart from "./RTChart";

const PatientRepository = RepositoryFactory.get("patient");

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
  error: {
    color: "#db1e1e",
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
  const [patientConfig, setPatientConfig] = useState({});
  const [issue, setIssue] = useState(false);
  const [errors, setErrors] = useState({
    ecg: true,
    spo2: false,
    rr: false,
    temp: false,
    pr: false,
    bp: false,
  });
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

  const [bpReading, setBPReading] = useState({
    sys: {
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      value: 0
    },
    dias: {
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      value: 0
    }
  });

  const getPatientConfig = async (id) => {
    if (id) {
      /* Query to get patient */
      try {
        const { data } = await PatientRepository.getPatientConfig(id);
        if (data.length > 0) {
          console.log(data[0]);
          setPatientConfig(data[0]);
        }
      } catch (e) {
        alert("No patient config");
        console.log(e);
      }
    }
  };

  const getECG = () => {
    // heart rate
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.ecg;
    });
    if (index >= 0) {
      const { tpo_value } = rxbox[index];

      return tpo_value;
    }
    return null;
  };

  const getBP = () => {
    let index;
    const systolicIndex = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.systolic_bp;
    });

    const diastolicIndex = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.diastolic_bp;
    });

    let systolicVal = systolicIndex >= 0 ? rxbox[systolicIndex].tpo_value : null;
    let diastolicVal = diastolicIndex >= 0 ? rxbox[diastolicIndex].tpo_value : null;

    if (!_.isEmpty(systolicVal) && !_.isEmpty(diastolicVal)) {
      
      const currentSys = rxbox[systolicIndex].tpo_effectivity;
      const currentDia = rxbox[diastolicIndex].tpo_effectivity;
    
      if (bpReading.sys.timestamp !== currentSys && bpReading.dias.timestamp !== currentDia) {
        
        setBPReading({
          sys:{
            timestamp: currentSys,
            value: systolicVal
          },
          dias:{
            timestamp: currentDia,
            value: diastolicVal
          }
        })
        console.log('updated bp reading');

      } else {

        systolicVal = bpReading.sys.value;
        diastolicVal = bpReading.dias.value;
        console.log('reset bp reading');

      }

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
      const { tpo_value } = rxbox[index];
      return tpo_value;
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
      const { tpo_value } = rxbox[index];
      return tpo_value;
    }
    if (secondaryIndex >= 0) {
      const { tpo_value } = rxbox[secondaryIndex];
      return tpo_value;
    }
    return null;
  };

  const getSpo2 = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.spo2;
    });
    if (index >= 0) {
      const { tpo_value } = rxbox[index];
      return tpo_value;
    }
    return null;
  };

  const getPulseRate = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.pr;
    });
    if (index >= 0) {
      const { tpo_value } = rxbox[index];
      return tpo_value;
    }
    return null;
  };

  const getTime = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.mean_arterial_pressure;
    });
    if (index >= 0) {
      setTime(moment(rxbox[index].tpo_effectivity).local().format("HH:mm"));
    }
  };

  const getMAP = () => {
    const index = _.findIndex(rxbox, function (o) {
      return o.tpo_code === code.mean_arterial_pressure;
    });
    if (index >= 0) {
      // setTime(moment(rxbox[index].tpo_effectivity).format("HH:mm"));
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

  const validateRxboxConfig = () => {
    if (!_.isEmpty(patientConfig)) {
      const err = { ...errors };
      const {
        rpc_bp_systolic_lower,
        rpc_bp_systolic_upper,
        rpc_bp_diastolic_upper,
        rpc_bp_diastolic_lower,
        rpc_temperature_lower, 
        rpc_temperature_upper,
        rpc_respiratory_lower_rpm, rpc_respiratory_upper_rpm,
        rpc_oxygen_lower_saturation, rpc_oxygen_upper_saturation,
        rpc_pulserate_lower_bpm, rpc_pulserate_upper_bpm
      } = patientConfig;
      err.temp = false;
      err.bp = false;
      err.rr = false;
      err.spo2 = false;
      err.pr = false;


      const tempValue = getTemp();
      const respValue = getRR();
      const spo2Value = getSpo2();
      const bpValue = getBP();
      const prValue = getPulseRate();

      if (tempValue) {
        if (tempValue > rpc_temperature_upper || tempValue < rpc_temperature_lower) {
          // error
          err.temp = true;
        }
      }

      if (respValue) {
        if (respValue > rpc_respiratory_upper_rpm || respValue < rpc_respiratory_lower_rpm) {
          // error
          err.rr = true;
        }
      }

      if (spo2Value) {
        if (spo2Value > rpc_oxygen_upper_saturation || spo2Value < rpc_oxygen_lower_saturation) {
          // error
          err.spo2 = true;
        }
      }

      if (bpValue) {
        const [systolicVal, diastolicVal] = bpValue.split("/");
        if (systolicVal > rpc_bp_systolic_upper || systolicVal < rpc_bp_systolic_lower) {
          // error
          err.bp = true;
        }
        if (diastolicVal > rpc_bp_diastolic_upper || diastolicVal < rpc_bp_diastolic_lower) {
          // error
          err.bp = true;
        }
      }

      if (prValue) {
        if (prValue > rpc_pulserate_upper_bpm || prValue < rpc_pulserate_lower_bpm) {
          // error
          err.pr = true;
        }
      }
      setErrors(err);
    }
  };

  const isError = (type) => {
    if (type) {
      const data = { ...errors };
      return data[type];
    }
  };

  const setStyle = (type) => {
    const style = { color: "#a9a99d" };
    switch (type) {
      case "ecg":
        if (getECG()) {
          style.margin = "auto";
          style.color = "#76db3d";
          if (isError(type)) {
            style.color = "#db1e1e";
          }
        }
        break;
      case "pr":
        if (getPulseRate()) {
          style.margin = "auto";
          style.color = "#17eaf1";
          if (isError(type)) {
            style.color = "#db1e1e";
          }
        }
        break;
      case "spo2":
        if (getSpo2()) {
          style.margin = "auto";
          style.color = "#17eaf1";
          if (isError(type)) {
            style.color = "#db1e1e";
          }
        }
        break;
      case "bp":
        if (getBP() && getMAP()) {
          style.margin = "auto";
          if (isError(type)) {
            style.color = "#db1e1e";
          }
        }
        break;
      case "rr":
        if (getRR()) {
          style.margin = "auto";
          style.color = "#f6f830";
          if (isError(type)) {
            style.color = "#db1e1e";
          }
        }
        break;
      case "temp":
        if (getTemp()) {
          style.margin = "auto";
          if (isError(type)) {
            style.color = "#db1e1e";
          }
        }
        break;
      default:
        break;
    }
    return style;
  };

  useEffect(() => {
    if (patient) {
      getPatientConfig(patient.rpi_patientid);
    }
  }, [patient]);

  useEffect(() => {
    validateRxboxConfig();
    getTime();
  }, [rxbox]);

  useEffect(() => {
    if (errors) {
      const arr = _.some(errors, true);
      if (arr) {
        setIssue(true);
      } else {
        setIssue(false);
      }
    }
  }, [errors]);

  return (
    <ThemeProvider theme={theme}>
      <Paper className={clsx(classes.paper, classes.TelemetryCard)}>
        <Grid
          container
          className={classes.bordered}
          style={issue ? { backgroundColor: "#db1e1e" } : {}}
        >
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
            // style={getECG() ? {} : { margin: "auto", color: "#a9a99d" }}
            style={setStyle("ecg")}
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
            // style={getPulseRate() ? {} : { margin: "auto", color: "#a9a99d" }}
            style={setStyle("pr")}
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
            // style={getSpo2() ? {} : { margin: "auto", color: "#a9a99d" }}
            style={setStyle("spo2")}
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
          <Grid
            item
            xs={2}
            // style={getMAP() && getBP() ? {} : { margin: "auto", color: "#a9a99d" }}
            style={setStyle("bp")}
          >
            {getMAP() && getBP() ? (
              <>
                <Grid container>
                  <Grid item align="left" xs={7}>
                    <Typography align="left" variant="caption">
                      NIBP @{time}
                      <Typography variant="caption" style={{ display: "block" }}>
                        {" "}
                        mmhg
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item align="right" xs={5}>
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
            // style={getRR() ? {} : { margin: "auto", color: "#a9a99d" }}
            style={setStyle("rr")}
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

          <Grid
            item
            xs={2}
            // style={getTemp() ? {} : { margin: "auto", color: "#a9a99d" }}
            style={setStyle("temp")}
          >
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
