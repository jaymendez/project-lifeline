import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Divider,
  Paper,
  InputAdornment,
  IconButton,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Create } from "@material-ui/icons";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RepositoryFactory } from "../../api/repositories/RepositoryFactory";
import Progress from "../utils/components/feedback/Progress";
import PatientChart from "./PatientChart";
import MaterialTable from "material-table";

const MySwal = withReactContent(Swal);
const PatientRepository = RepositoryFactory.get("patient");
const MonitorRepository = RepositoryFactory.get("monitor");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  table: {
    minWidth: 650,
  },
  card: {
    maxWidth: 340,
  },
  row: {
    margin: "15px 0px",
  },
  invisible: {
    visibility: "hidden",
  },
  hide: {
    display: "none",
  },
  empty: {
    border: "dashed 1px white",
  },
  occupied: {
    border: "solid 1px white",
  },
  cardContent: {
    paddingBottom: "10px !important",
    padding: "0px",
  },
  whiteText: {
    color: "#ffffff",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: "80%",
  },
  detailsKey: {
    marginRight: 20,
  },
}));

const PatientDetails = (props) => {
  const classes = useStyles();
  const { match } = props;
  const [ward] = useState("UP-PGH WARD 1");
  const { register, handleSubmit, watch, errors, control, setValue, getValues } = useForm();
  const [patient, setPatient] = useState({});
  const [patientConfig, setPatientConfig] = useState({});
  const [loader, setLoader] = useState(true);
  const [mode, setMode] = useState("READ");
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
  const [observationList] = useState([
    {
      name: "HEART RATE",
      legend: "HR",
      code: "76282-3",
    },
    {
      name: "PULSE RATE",
      legend: "PR",
      code: "8889-8",
    },
    {
      name: "SPO2",
      legend: "%",
      code: "59407-7",
    },
    {
      name: "RESPIRATORY RATE",
      legend: "RR",
      code: "76270-8",
    },
    {
      name: "BLOOD PRESSURE",
      data: [
        {
          legend: "SYSTOLIC",
          code: "8480-6",
        },
        {
          legend: "DIASTOLIC",
          code: "8462-4",
        },
        {
          legend: "MAP",
          code: "8478-0",
        },
      ],
    },
    {
      name: "TEMPERATURE",
      legend: "CELSIUS",
      code: "8310-5",
    },
  ]);
  console.log(errors);
  const [requestId, setRequestId] = useState(null);

  const getPatient = async (id) => {
    if (id) {
      /* Query to get patient */
      try {
        const { data } = await PatientRepository.getPatient(id);
        setPatient(data.PatientData_report[0]);
      } catch (e) {
        alert("no patient with that id");
        console.log(e);
      }
      setLoader(false);
    }
  };

  const getPatientConfig = async (id) => {
    if (id) {
      /* Query to get patient */
      try {
        const { data } = await PatientRepository.getPatientConfig(id);
        if (data.length > 0) {
          setPatientConfig(data[0]);
          for (let [key, value] of Object.entries(data[0])) {
            key = key.slice(key.search("_") + 1);
            setValue(key, value);
          }
        }
      } catch (e) {
        alert("No patient config");
        console.log(e);
      }
      setLoader(false);
    }
  };

  const updatePatientConfig = async (formData) => {
    setLoader(true);
    try {
      const patientId = patient.rpi_patientid;
      const response = await PatientRepository.addPatientConfig({
        patientid: patientId,
        ...formData,
      });
      getPatientConfig(patientId);
      if (response) {
        MySwal.fire({
          icon: "success",
          title: "Patient Config updated!",
        });
      }
    } catch (e) {
      if (e) {
        // alert("no patient with that id");
        console.log(e);
        MySwal.fire({
          icon: "error",
          title: "Update failed.",
        });
      }
    }
    setMode("READ");
    setLoader(false);
  };

  const onSubmit = (data) => {
    updatePatientConfig(data);
  };

  useEffect(() => {
    getPatient(match.params.id);
    getPatientConfig(match.params.id);
  }, []);

  const requestBP = async () => {
    try {
      const patientId = patient.rpi_patientid;
      const { data } = await MonitorRepository.requestBP(patientId);
      setRequestId(data.RequestResult[0].requestid);
    } catch (e) {
      if (e) {
        // alert("no patient with that id");
        console.log(e);
        MySwal.fire({
          icon: "error",
          title: "Request BP failed.",
          text: e,
        });
      }
    }
  };

  const confirmBPRequest = () => {
    const LIMIT = 4;
    const SECONDS = 30;
    let cnt = 0;
    console.log('confirm BPO');
    const query = setInterval(() => {
      if (requestId) {
        if (cnt <= LIMIT) {
          if (getBPRequest(requestId)) {
            MySwal.fire({
              icon: "success",
              title: "BP Success.",
            });
            clearInterval(query);
          }
        } else {
          clearInterval(query);
        }
        cnt++;
      }
    }, 1000*SECONDS)
  };

  const getBPRequest = async (requestid) => {
    try {
      const { data } = await MonitorRepository.getRequestBPValue(requestid);
      return data.BPValue.length;
    } catch (e) {
      if (e) {
        console.log(e);
        MySwal.fire({
          icon: "error",
          title: "Request BP failed.",
          text: e,
        });
      }
    }
  }

  useEffect(() => {
    confirmBPRequest();

  }, [requestId])

  return (
    <>
      <Progress open={loader} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography className={classes.row} align="left" variant="h4">
            {`${ward}: COVID-19 PATIENT CHART`}
          </Typography>
        </Grid>
        <Divider />
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                {/* 1st row */}
                <Grid alignItems="center" container>
                  <Grid item xs={4} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      Bed #:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_bednumber || "----"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      DATE ADMITTED:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_date_admitted ? patient.rpi_date_admitted.slice(0, 10) : "----"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      TIME ADMITTED:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_date_admitted ? patient.rpi_date_admitted.slice(10) : "----"}
                    </Typography>
                  </Grid>
                </Grid>
                {/* 2nd row */}
                <Grid alignItems="center" container>
                  <Grid item xs={6} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      NAME:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {`${patient.rpi_patientfname || "----"} ${
                        patient.rpi_patientlname || "----"
                      }`}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} />
                  <Grid item xs={3} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      GENDER:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_gender || "----"}
                    </Typography>
                  </Grid>
                </Grid>
                {/* 3rd row */}
                <Grid alignItems="center" container>
                  <Grid item xs={4} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      DOB:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_birthday || "----"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      AGE:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_age || "----"}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      CIVIL STATUS:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_civilstatus || "----"}
                    </Typography>
                  </Grid>
                </Grid>
                {/* 4th row */}
                <Grid alignItems="center" container>
                  <Grid item xs={12} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      ADDRESS:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_address || "----"}
                    </Typography>
                  </Grid>
                </Grid>
                {/* 5th row */}
                <Grid alignItems="center" container>
                  <Grid item xs={6} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      EMERGENCY CONTACT:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_contact_name || "----"}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} />
                  <Grid item xs={3} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      RELATIONSHIP:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_contact_relationship || "----"}
                    </Typography>
                  </Grid>
                </Grid>
                {/* 6th row */}
                <Grid alignItems="center" container>
                  <Grid item xs={6} align="left">
                    <Typography
                      // display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      PATIENT HISTORY/NOTES:
                    </Typography>
                    <TextField
                      margin="dense"
                      variant="outlined"
                      rows={3}
                      multiline
                      name="remarks"
                      value={`-lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor

                      -lorem ipsum

                      -lorem ipsum dolor lorem ipsum dolor

                      -lorem

                      `}
                      // onChange={patientHandler}
                    />
                  </Grid>
                  <Grid item xs={3} />
                  <Grid item xs={3} />
                </Grid>
              </Grid>
              <Grid item xs={4}>
                {/* 1st row */}
                <Grid container>
                  <Grid item xs={12} style={{ marginBottom: 15 }}>
                    <Grid container spacing={3}>
                      <Grid item xs>
                        <div style={{ backgroundColor: "#f66464", padding: "5px", color: "white" }}>
                          <Typography display="inline" variant="body1" color="inherit">
                            {patient.rpi_classification || "----"}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div style={{ backgroundColor: "#72b4ee", padding: "5px", color: "white" }}>
                          <Typography display="inline" variant="body1" color="inherit">
                            {patient.rpi_covid19 || "----"}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div style={{ backgroundColor: "#ebebeb", padding: "5px" }}>
                          <Typography display="inline" variant="body1" color="inherit">
                            {patient.rpi_covid19 || "----"}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      CONTACT NOS:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_contact || "----"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      EMAIL:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_email_add || "----"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      EMERGENCY CONTACT NO.:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_contact_number || "----"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      SSS/GSIS:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_sss_gsis_number || "----"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} align="left">
                    <Typography
                      display="inline"
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      className={classes.detailsKey}
                    >
                      PHILHEALTH:
                    </Typography>
                    <Typography display="inline" variant="h6" color="textPrimary" gutterBottom>
                      {patient.rpi_philhealth_number || "----"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* PATIENT CONFIG */}
            <Typography variant="h5" align="left" style={{ marginTop: 30 }}>
              PARAMETER SETTINGS
              <IconButton style={{ margin: 10 }} onClick={() => setMode("EDIT")}>
                <Create />
              </IconButton>
            </Typography>
            <Divider style={{ marginTop: 5 }} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={1} style={{ padding: 30 }}>
                <Grid item xs={3}>
                  <Typography variant="h6" align="left" style={{ marginBottom: 15 }}>
                    ECG
                  </Typography>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        ST:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // value={patientConfig.rpc_ecg_st_msec || 0}
                        name="ecg_st_msec"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">msec</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        error={!_.isEmpty(errors.ecg_st_msec)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                        // inputRef={register({ required: true })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" align="left" style={{ marginBottom: 15 }}>
                    HEART RATE
                  </Typography>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Upper:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="heartrate_upper_bpm"
                        error={!_.isEmpty(errors.heartrate_upper_bpm)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Lower:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="heartrate_lower_bpm"
                        error={!_.isEmpty(errors.heartrate_lower_bpm)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" align="left" style={{ marginBottom: 15 }}>
                    PULSE RATE
                  </Typography>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Upper:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="pulserate_upper_bpm"
                        error={!_.isEmpty(errors.pulserate_upper_bpm)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Lower:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="pulserate_lower_bpm"
                        error={!_.isEmpty(errors.pulserate_lower_bpm)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  {/* START */}
                  <Typography variant="h6" align="left" style={{ marginBottom: 15 }}>
                    OXYGEN SATURATION
                  </Typography>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Upper:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        id="standard-start-adornment"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="oxygen_upper_saturation"
                        error={!_.isEmpty(errors.oxygen_upper_saturation)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Lower:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="oxygen_lower_saturation"
                        error={!_.isEmpty(errors.oxygen_lower_saturation)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  {/* START */}
                  <Typography variant="h6" align="left" style={{ marginBottom: 15 }}>
                    RESPIRATORY RATE
                  </Typography>
                  <br />
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Upper:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">rpm</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="respiratory_upper_rpm"
                        error={!_.isEmpty(errors.respiratory_upper_rpm)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Lower:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">rpm</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="respiratory_lower_rpm"
                        error={!_.isEmpty(errors.respiratory_lower_rpm)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  {/* START */}
                  <Typography variant="h6" align="left" style={{ marginBottom: 15 }}>
                    BLOOD PRESSURE
                  </Typography>
                  <Grid container alignItems="center" justify="space-evenly" direction="row">
                    <Grid item xs={3}>
                      <Typography variant="body1">Systolic</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body1">Diastolic</Typography>
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Upper:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">mm Hg</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="bp_systolic_upper"
                        error={!_.isEmpty(errors.bp_systolic_upper)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Upper:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">mm Hg</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="bp_diastolic_upper"
                        error={!_.isEmpty(errors.bp_diastolic_upper)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Lower:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">mm Hg</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="bp_systolic_lower"
                        error={!_.isEmpty(errors.bp_systolic_lower)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Lower:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">mm Hg</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="bp_diastolic_lower"
                        error={!_.isEmpty(errors.bp_diastolic_lower)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                  </Grid>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Time Frame:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="bp_time_frame"
                        error={!_.isEmpty(errors.bp_time_frame)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  {/* START */}
                  <Typography variant="h6" align="left" style={{ marginBottom: 15 }}>
                    TEMPERATURE
                  </Typography>
                  <br />
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Upper:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">C</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="temperature_upper"
                        error={!_.isEmpty(errors.temperature_upper)}
                        inputRef={register({
                          validate: {
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                  <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={1}>
                      <Typography
                        variant="subtitle2"
                        display="initial"
                        style={{ display: "initial", marginRight: 3 }}
                      >
                        Lower:
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        size="small"
                        // className={clsx(classes.margin, classes.textField)}
                        className={classes.textField}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">C</InputAdornment>,
                          // readOnly: mode === "READ",
                        }}
                        disabled={mode === "READ"}
                        name="temperature_lower"
                        error={!_.isEmpty(errors.temperature_lower)}
                        inputRef={register({
                          validate: {
                            // integer: (value) =>
                            //   parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0,
                            integer: (value) => {
                              if (typeof value === "string" && value.length === 0) {
                                value = 0;
                              }
                              return parseInt(value, 10) >= 0 || parseInt(value, 10) <= 0;
                            },
                          },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} />
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  justify="flex-end"
                  style={mode === "READ" ? { visibility: "hidden", marginTop: "30px" } : { marginTop: "30px" }}
                  spacing={2}
                >
                  <Grid item xs={1} style={{ marginRight: "15px" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={() => setMode("READ")}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={1} style={{ marginRight: "15px" }}>
                    <Button
                      fullWidth
                      type="submit"
                      disabled={mode === "READ"}
                      variant="contained"
                      color="primary"
                    >
                      SAVE
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
            {/* END PATIENT CONFIG */}
            <Typography variant="h5" align="left" style={{ marginTop: 30 }}>
              ACTIONS
            </Typography>
            <Divider style={{ marginTop: 5 }} />
            <Grid container>
              <Grid item xs={3}>
                <Button
                  onClick={requestBP}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: 15, float: "left" }}
                >
                  BP NOW
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <Paper elevation={3} className={classes.paper} style={{marginTop: "50px"}}>
            <MaterialTable
              // other props
              options={{
                filtering: true
              }}
            />
          </Paper>
          {observationList.map((el) => {
            return (
              <PatientChart
                style={{ marginTop: "50px" }}
                patientId={patient.rpi_patientid}
                observation={el}
              />
            );
          })}
        </Grid>
      </Grid>
    </>
  );
};

export default PatientDetails;
