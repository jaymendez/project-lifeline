import React, { useState } from "react";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import { Close } from "@material-ui/icons";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import _ from "lodash";
import { useForm } from "react-hook-form";
import DateTimePatientCards from "../utils/components/toolbar/DateTimePatientCards";
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
  formControl: {
    width: 200,
  },
}));

const PatientRegister = () => {
  const classes = useStyles();
  const { register, handleSubmit, watch, errors } = useForm();
  const [patient, setPatient] = useState({
    lastname: "",
    firstname: "",
    birthdate: null,
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
    emergency_name: "",
    emergency_relationship: "",
    emergency_contact_number: "",
  });

  const patientHandler = (e, modifiedVal = null) => {
    const data = { ...patient };
    if (e) {
      data[e.target.name] = e.target.value;
    } else {
      const { key, value } = modifiedVal;
      switch (key) {
        case "birthdate":
          data[key] = value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : null;
          let diffInYears = moment().diff(moment(value), "years");
          if (diffInYears === 0) {
            diffInYears = moment().diff(moment(value), "years", true).toFixed(3);
          }
          data.age = diffInYears || "";
          break;
        default:
          break;
      }
    }
    setPatient(data);
  };

  const emergencyContactHandler = (e) => {
    const data = { ...emergencyContact };
    data[e.target.name] = e.target.value;
    setEmergencyContact(data);
  };

  const validateInputs = (data) => {
    const response = {
      patientfname: data.firstname,
      patientmname: "",
      patientlname: data.lastname,
      remarks: data.remarks,
      birthday: data.birthdate,
      gender: data.gender,
      age: data.age,
      covid19: data.covid19_case,
      address: data.address,
      city: data.city,
      country: data.country,
      contact: data.contact_number,
      email: data.email,
      sss_gsis: data.sss_gsis_number,
      philhealth: data.philhealth_number,
      hmo: data.hmo,
      admission: data.date_admitted,
      ward: "1",
      emcontactname: data.emergency_name,
      emcontactnumber: data.emergency_contact_number,
      emrelationship: data.emergency_relationship,
    };
    return response;
  };

  const onSubmit = async (data) => {
    const payload = validateInputs({ ...data });
    const formData = new FormData();

    // for (let [key, value] of Object.entries(payload)) {
    //   formData.append(key, value);
    // }

    for (var key in payload) {
      formData.append(key, payload[key]);
    }

    const result = await PatientRepository.createPatient(formData)
      .then((res) => {
        console.log(res);
        if (res.data.addpatient_report) {
          alert("success");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <DateTimePatientCards className={classes.row} />
      <Typography align="left" variant="h4">
        Register Patient
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {console.log(errors)}
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
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      Last Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      error={errors.lastname}
                      margin="dense"
                      variant="outlined"
                      name="lastname"
                      // value={patient.lastname}
                      // onChange={patientHandler}
                      inputRef={register({ required: true })}
                    />
                  </Grid>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      Date of Birth:
                    </Typography>
                  </Grid>
                  <Grid item xs={2} align="left">
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DatePicker
                        error={errors.birthdate}
                        inputVariant="outlined"
                        format="MM/DD/YYYY"
                        clearable
                        disableFuture
                        name="birthdate"
                        value={patient.birthdate}
                        onChange={(date) => {
                          patientHandler(null, { key: "birthdate", value: date });
                          // setBirthdate(date.format("YYYY-MM-DD"));
                        }}
                        inputRef={register({ required: true })}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      Age:
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <TextField
                      margin="dense"
                      variant="outlined"
                      name="age"
                      value={patient.age}
                      // onChange={patientHandler}
                      disabled
                      inputRef={register({ required: true })}
                    />
                  </Grid>
                </Grid>

                <Grid container alignItems="center" className={classes.gridInputMargin}>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      First Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      error={errors.firstname}
                      margin="dense"
                      variant="outlined"
                      name="firstname"
                      // value={patient.firstname}
                      // onChange={patientHandler}
                      inputRef={register({ required: true })}
                    />
                  </Grid>

                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      Gender:
                    </Typography>
                  </Grid>
                  <Grid item xs={2} align="left">
                    <FormControl margin="dense" variant="outlined" className={classes.formControl}>
                      {/* <InputLabel htmlFor="grouped-select">Grouping</InputLabel> */}
                      <Select
                        id="grouped-select"
                        labelId="covid-case"
                        // value={patient.gender}
                        // onChange={patientHandler}
                        name="gender"
                        inputRef={register({ required: true })}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container alignItems="center" className={classes.gridInputMargin}>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      COVID-19 Case:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <FormControl margin="dense" variant="outlined" className={classes.formControl}>
                      {/* <InputLabel htmlFor="grouped-select">Grouping</InputLabel> */}
                      <Select
                        id="grouped-select"
                        labelId="covid-case"
                        // value={patient.covid19_case}
                        // onChange={patientHandler}
                        name="covid19_case"
                        inputRef={register}
                      >
                        <ListSubheader>Confirmed Covid-19 Case</ListSubheader>
                        <MenuItem value="Stable or No Co-morbid">Stable or No Co-morbid</MenuItem>
                        <MenuItem value="Stable or Unstable Co-morbid">
                          Stable or Unstable Co-morbid
                        </MenuItem>
                        <MenuItem value="CAP-HR, Sepsis or Shock">CAP-HR, Sepsis or Shock</MenuItem>
                        <MenuItem value="ARDS">ARDS</MenuItem>
                        <ListSubheader>PUI</ListSubheader>
                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                        <MenuItem value="Probable">Probable</MenuItem>
                        <MenuItem value="Suspect">Suspect</MenuItem>
                      </Select>
                    </FormControl>

                    {/* <TextField
                    margin="dense"
                    variant="outlined"


                  /> */}
                  </Grid>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
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
                      // value={patient.remarks}
                      // onChange={patientHandler}
                      inputRef={register}
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
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
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
                      // value={patient.address}
                      // onChange={patientHandler}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
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
                      // value={patient.city}
                      // onChange={patientHandler}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
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
                      // value={patient.country}
                      // onChange={patientHandler}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      Contact No.:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      margin="dense"
                      variant="outlined"
                      name="contact_number"
                      // value={patient.contact_number}
                      // onChange={patientHandler}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      Email Address:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      margin="dense"
                      variant="outlined"
                      name="email_address"
                      // value={patient.email_address}
                      // onChange={patientHandler}
                      inputRef={register}
                    />
                  </Grid>
                </Grid>
                <Grid container alignItems="center" style={{ margin: "15px" }}>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="left" color="textSecondary" gutterBottom>
                      Person to contact in case of Emergency
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems="center" className={classes.gridInputMargin}>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      margin="dense"
                      variant="outlined"
                      name="emergency_name"
                      // value={emergencyContact.emergency_name}
                      // onChange={emergencyContactHandler}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      Contact No.:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      margin="dense"
                      variant="outlined"
                      name="emergency_contact_number"
                      // value={emergencyContact.emergency_contact_number}
                      // onChange={emergencyContactHandler}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={2} />
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      Relationship:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      margin="dense"
                      variant="outlined"
                      name="emergency_relationship"
                      // value={emergencyContact.emergency_relationship}
                      // onChange={emergencyContactHandler}
                      inputRef={register}
                    />
                  </Grid>
                </Grid>
                <Grid container alignItems="center" style={{ margin: "15px" }}>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="left" color="textSecondary" gutterBottom>
                      Other Information
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container alignItems="center" className={classes.gridInputMargin}>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      SSS/GSIS no.:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      margin="dense"
                      variant="outlined"
                      name="sss_gsis_number"
                      // value={patient.sss_gsis_number}
                      // onChange={patientHandler}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      Philhealth no.:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      margin="dense"
                      variant="outlined"
                      name="philhealth_number"
                      // value={patient.philhealth_number}
                      // onChange={patientHandler}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={2} />
                  <Grid item xs={5} />
                  <Grid item xs={2} align="left">
                    <Typography variant="body1" align="left" color="textSecondary" gutterBottom>
                      HMO:
                    </Typography>
                  </Grid>
                  <Grid item xs={3} align="left">
                    <TextField
                      margin="dense"
                      variant="outlined"
                      name="hmo"
                      // value={patient.hmo}
                      // onChange={patientHandler}
                      inputRef={register}
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
                  <Grid item xs={1} style={{ marginRight: "15px" }}>
                    <Button color="secondary">Cancel</Button>
                  </Grid>
                  <Grid item xs={1} style={{ marginRight: "15px" }}>
                    <Button type="submit" variant="contained" color="primary">
                      Register
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default PatientRegister;
