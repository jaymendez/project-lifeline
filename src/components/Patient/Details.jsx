import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  FormControl,
  MenuItem,
  Select,
  ListSubheader,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { RepositoryFactory } from "../../api/repositories/RepositoryFactory";

const PatientRepository = RepositoryFactory.get("patient");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
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
    width: "25ch",
  },
  detailsKey: {
    marginRight: 20,
  },
}));

const PatientDetails = (props) => {
  const classes = useStyles();
  const { match } = props;
  const [ward] = useState("UP-PGH WARD 1");
  const [patient, setPatient] = useState({});
  const getPatient = async (id) => {
    if (id) {
      /* Query to get patient */
      try {
        const { data } = await PatientRepository.getPatient(id);
        console.log(data);
        const index = data.search("<br>");
        const parsedData = data.slice(0, index);
        const jsonData = JSON.parse(parsedData);
        setPatient(jsonData.PatientData_report[0]);
        console.log(jsonData);
      } catch (e) {
        alert("no patient with that id");
        console.log(e);
      }
    }
  };

  useEffect(() => {
    getPatient(match.params.id);
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography className={classes.row} align="left" variant="h4">
            {ward}: COVID-19 PATIENT LIST
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
                      {patient.bed_number || 20}
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
                      {patient.rpi_date_admitted || "1999/20/21"}
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
                      {patient.rpi_date_admitted || "04:43:45 PM"}
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
                      {`${patient.rpi_patientfname} ${patient.rpi_patientlname}` || "Cardo Dalisay"}
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
                      {patient.rpi_gender || "Male"}
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
                      {patient.rpi_birthday || "Sept. 21, 2001"}
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
                      {patient.rpi_age || 99}
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
                      {patient.rpi_civil_status || "Single"}
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
                      {patient.rpi_address ||
                        "Unit 706 Pacific Grand Suites, Santander St., Dapitan, Manila Philippines"}
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
                      {patient.rpi_contact_name || "Asawa ni Dalisay"}
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
                      {patient.rpi_contact_relationship || "Wife"}
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
                  <Grid item xs={3} align=""></Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                {/* 1st row */}
                <Grid container>
                  <Grid item xs={12} style={{marginBottom: 15}}>
                    <Grid container spacing={3}>
                      <Grid item xs>
                        <div style={{ backgroundColor: "#f66464", padding: "5px", color: "white" }}>
                          <Typography display="inline" variant="body1" color="inherit">
                            {patient.rpi_covid19 || "CONFIRMED"}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div style={{ backgroundColor: "#72b4ee", padding: "5px", color: "white" }}>
                          <Typography display="inline" variant="body1" color="inherit">
                            {patient.rpi_covid19 || "Stable or no co morbid"}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs>
                        <div style={{ backgroundColor: "#ebebeb", padding: "5px" }}>
                          <Typography display="inline" variant="body1" color="inherit">
                            {patient.rpi_covid19 || "RxBOX sku 1234"}
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
                      {patient.rpi_contact || "0916123456"}
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
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PatientDetails;
