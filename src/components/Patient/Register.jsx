import React, { useState } from "react";
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
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  TextField,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Settings,
  MoreVert,
  DateRange,
  Alarm,
  Person,
  LibraryAdd,
  Close,
} from "@material-ui/icons";
import moment from "moment";
import _ from "lodash";
import DateTimePatientCards from "../utils/components/toolbar/DateTimePatientCards";

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
  title: {
    fontSize: 14,
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
  gridInputMargin: {
    marginLeft: "15px",
  },
}));

const PatientRegister = () => {
  const classes = useStyles();
  const [patient, setPatient] = useState({
    lastname: "",
    firstname: "",
    birthdate: "",
    age: "",
    gender: "",
    covid19_case: "",
    remarks: "",
    address: "",
    city: "",
    country: "",
    contact_number: "",
    email_address: "",
    sss_gsis_number: "",
    philhealth_number: "",
    hmo: "",
  });
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    contact_number: "",
  });

  const patientHandler = (e) => {
    const data = { ...patient };
    data[e.target.name] = e.target.value;
    setPatient(data);
  };

  const emergencyContactHandler = (e) => {
    const data = { ...emergencyContact };
    data[e.target.name] = e.target.value;
    setEmergencyContact(data);
  };

  return (
    <>
      <DateTimePatientCards className={classes.row} />
      <Typography align="left" variant="h4">
        Register Patient
      </Typography>
      <Grid container>
        <Grid item xs={2} />
        <Grid item align="" xs={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" align="left" color="textSecondary" gutterBottom>
                Personal Information
              </Typography>
              <Divider light style={{ marginBottom: "15px" }} />
              <Grid container alignItems="center" className={classes.gridInputMargin}>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Last Name:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="lastname"
                    value={patient.lastname}
                    onChange={patientHandler}
                  />
                </Grid>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Date of Birth:
                  </Typography>
                </Grid>
                <Grid item xs={2} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="birthdate"
                    value={patient.birthdate}
                    onChange={patientHandler}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Age:
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="age"
                    value={patient.age}
                    onChange={patientHandler}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center" className={classes.gridInputMargin}>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    First Name:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="firstname"
                    value={patient.firstname}
                    onChange={patientHandler}
                  />
                </Grid>

                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Gender:
                  </Typography>
                </Grid>
                <Grid item xs={2} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="gender"
                    value={patient.gender}
                    onChange={patientHandler}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center" className={classes.gridInputMargin}>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    COVID-19 Case:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="covid19_case"
                    value={patient.covid19_case}
                    onChange={patientHandler}
                  />
                </Grid>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Note/s:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    rows={3}
                    multiline
                    name="remarks"
                    value={patient.remarks}
                    onChange={patientHandler}
                  />
                </Grid>
              </Grid>
              <Typography
                variant="h5"
                align="left"
                color="textSecondary"
                gutterBottom
                className={classes.row}
              >
                Contact Information
              </Typography>
              <Divider light style={{ marginBottom: "15px" }} />
              <Grid container alignItems="center" className={classes.gridInputMargin}>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Address:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    multiline
                    name="address"
                    value={patient.address}
                    onChange={patientHandler}
                  />
                </Grid>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    City:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    multiline
                    name="city"
                    value={patient.city}
                    onChange={patientHandler}
                  />
                </Grid>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Country/State:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    multiline
                    name="country"
                    value={patient.country}
                    onChange={patientHandler}
                  />
                </Grid>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Contact No.:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="contact_number"
                    value={patient.contact_number}
                    onChange={patientHandler}
                  />
                </Grid>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Email Address:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="email_address"
                    value={patient.email_address}
                    onChange={patientHandler}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center" style={{ margin: "15px" }}>
                <Grid item xs={4}>
                  <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                    Person to contact in case of Emergency
                  </Typography>
                </Grid>
              </Grid>
              <Grid container alignItems="center" className={classes.gridInputMargin}>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Name:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="name"
                    value={emergencyContact.name}
                    onChange={emergencyContactHandler}
                  />
                </Grid>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Contact No.:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="contact_number"
                    value={emergencyContact.contact_number}
                    onChange={emergencyContactHandler}
                  />
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Relationship:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="relationship"
                    value={emergencyContact.relationship}
                    onChange={emergencyContactHandler}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center" style={{ margin: "15px" }}>
                <Grid item xs={4}>
                  <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                    Other Information
                  </Typography>
                </Grid>
              </Grid>
              <Grid container alignItems="center" className={classes.gridInputMargin}>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    SSS/GSIS no.:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="sss_gsis_number"
                    value={patient.sss_gsis_number}
                    onChange={patientHandler}
                  />
                </Grid>
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    Philhealth no.:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="philhealth_number"
                    value={patient.philhealth_number}
                    onChange={patientHandler}
                  />
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={5} />
                <Grid item xs={2} align="left">
                  <Typography variant="subtitle" align="left" color="textSecondary" gutterBottom>
                    HMO:
                  </Typography>
                </Grid>
                <Grid item xs={3} align="left">
                  <TextField
                    margin="dense"
                    variant="outlined"
                    name="hmo"
                    value={patient.hmo}
                    onChange={patientHandler}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                alignItems="center"
                justify="flex-end"
                style={{ marginTop: "30px" }}
                spacing={2}
              >
                <Grid items xs={1} style={{ marginRight: "15px" }}>
                  <Button color="secondary">Cancel</Button>
                </Grid>
                <Grid items xs={1} align="right">
                  <Button variant="contained" color="primary">
                    Register
                  </Button>
                </Grid>
                <Grid items xs={1} />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PatientRegister;
