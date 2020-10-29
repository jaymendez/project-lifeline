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
import { Create, RedoTwoTone } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import _ from "lodash";
import { RepositoryFactory } from "../../api/repositories/RepositoryFactory";

const PatientRepository = RepositoryFactory.get("patient");

const MySwal = withReactContent(Swal);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginTop: 50,
  },
}));

const PatientNotes = ({data, getPatient}) => {
  const classes = useStyles();
  const parser = {
    email_add: "email",
    sss_gsis_number: "sss_gsis",
    philhealth_number: "philhealth",
    ward_id: "ward",
    civilstatus: "civil_status",
    contact_name: "emcontactname",
    contact_number: "emcontactnumber",
    contact_relationship: "emrelationship",
    bednumber: "bed_no",
    date_admitted: "admissiondate",
    rps_case: "covidcase",
    rps_admission: "admissionstatus",
    rps_class: "classification",
    classification: "deprecated",
    admissionstatus: "deprecated",
    covidcase: "deprecated"
  }
  const [mode, setMode] = useState("READ");
  const [note, setNotes] = useState("");
  const [editNote, setEditNote] = useState("");
  const [patient, setPatient] = useState({});

  const toggleMode = () => setMode(mode === "READ" ? "EDIT" : "READ");

  useEffect(()=> {
    setNotes(data.rpi_remarks);
    setEditNote(data.rpi_remarks);
    setPatient(data);
  }, [data]);

  const handleSave = (e) => {
    updatePatient();
  };

  const updatePatient = async () => {
    const formData = new FormData();

    for (let [key, value] of Object.entries(patient)) {
      if (typeof value === "undefined") {
        value = "";
      }
      if (value === null) {
        value = 0;
      }
      if (typeof value === "string") {
        value = value.trim();
      }
      if (key === "rpi_remarks") {
        value = editNote;
      }
      if (key.search("rpi") >= 0) {
        key = key.slice(4);
      }
      if (parser[key]) {
        key = parser[key];
      }
      formData.append(key, value);
    }
    const data = await PatientRepository.updatePatient(formData);
    if (data) {
      await getPatient(patient.rpi_patientid);
      toggleMode();
    }
  }

  const confirmCancel = () => {
    if (_.isEqual(note, editNote)) {
      toggleMode();
    } else {
      MySwal.fire({
        title: "Are you sure?",
        text: "You want to discard changes?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.value) {
          toggleMode();
          setEditNote(note);
        }
      });
    }
  }
  
  return (
    <>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h5" align="left">
          PATIENT HISTORY/NOTES{" "}
          <IconButton style={{ marginLeft: 10 }} onClick={confirmCancel}>
            <Create />
          </IconButton>
        </Typography>
        <Divider />
          <TextField
            style={{marginTop: 20}}
            fullWidth
            margin="dense"
            variant="outlined"
            rows={15}
            multiline
            name="remarks"
            placeholder={"Notes about patient..."}
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            InputProps={{
              readOnly: mode === "READ",
            }}
          />
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
                onClick={confirmCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={1} style={{ marginRight: "15px" }}>
              <Button
                fullWidth
                // type="submit"
                disabled={mode === "READ"}
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                SAVE
              </Button>
            </Grid>
          </Grid>
      </Paper>
    </>
  );
};

export default PatientNotes;
