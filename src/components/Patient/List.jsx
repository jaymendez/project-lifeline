import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
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
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControl,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Menu,
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
  Search,
} from "@material-ui/icons";
import moment from "moment";
// import MaterialTable from "material-table";
import _ from "lodash";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DateTimePatientCards from "../utils/components/toolbar/DateTimePatientCards";
import MaterialTable from "../utils/components/table/MaterialTable";
import { MTableToolbar, MTableBodyRow } from "material-table";
import { RepositoryFactory } from "../../api/repositories/RepositoryFactory";

const PatientRepository = RepositoryFactory.get("patient");
const StatuscodesRepository = RepositoryFactory.get("statuscodes");
const MySwal = withReactContent(Swal);

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
}));

const PatientList = (props) => {
  const { history } = props;
  const classes = useStyles();
  const [filter, setFilter] = useState({
    search: "",
    admissionStatus: "Active",
    covidStatus: "",
    classificationStatus: ""
  });
  const [ward, setWard] = useState("UP-PGH WARD 1");
  const [patients, setPatients] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [chosenPatient, setChosenPatient] = useState({});
  const [patientStatus, setPatientStatus] = useState([]);

  const toggleOptions = (event, patient) => {
    setAnchorEl(event.currentTarget);
    setChosenPatient(patient);
    // console.log(patient);
  };

  const closeOptions = () => {
    setAnchorEl(null);
  };

  const getStatuscodes = async () => {
    const { data: covidStatus } = await StatuscodesRepository.getPatientCovidCase();
    const { data: classificationStatus } = await StatuscodesRepository.getPatientClassification();
    const { data: admission } = await StatuscodesRepository.getPatientAdmissionStatus();
    setPatientStatus([
      ...covidStatus.filter_statuscode_report,
      ...classificationStatus.filter_statuscode_report,
      ...admission.filter_statuscode_report,
    ]);
  };

  const getPatients = async () => {
    const result = await PatientRepository.getPatients();
    setPatients(result.data.getpatientlist_report);
  };

  useEffect(() => {
    getPatients();
    getStatuscodes();
  }, []);

  const filteredPatients = () => {
    let data = [...patients];

    if (filter.admissionStatus) {
      data = data.filter((el) => {
        return el["Admission Status"] === filter.admissionStatus;
      });
    }
    if (filter.covidStatus) {
      data = data.filter((el) => {
        return el["Covid Case"] === filter.covidStatus;
      });
    }
    if (filter.classificationStatus) {
      data = data.filter((el) => {
        return el.classification === filter.classificationStatus;
      });
    }
    return data;
  };

  const updateHandler = () => {
    const { rpi_patientid: id } = chosenPatient;
    history.push({ pathname: `/patient/update/${id}`, state: "" });
  };

  const deleteHandler = () => {
    closeOptions();
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      onClose: () => {
        setChosenPatient({});
      },
    }).then((result) => {
      if (result.value) {
        // deletePatient()
        const { rpi_patientid: id } = chosenPatient;
        deletePatient(id);
      }
    });
  };

  const deletePatient = async (id) => {
    const { data } = await PatientRepository.deletePatient(id);
    if (data.deletepatient_report[0].deletepatient_report === "deleted") {
      // success
      MySwal.fire({
        icon: "success",
        title: "Patient removed.",
        showConfirmButton: true,
        onClose: () => getPatients(),
      });
    }
  };

  const columns = [
    {
      title: "Name",
      field: "rpi_patientfname",
      render: (rowData) => `${rowData.rpi_patientfname} ${rowData.rpi_patientlname}`,
      customFilterAndSearch: (value, rowData) => {
        if (
          rowData.rpi_patientfname.toLowerCase().includes(value.toLowerCase()) ||
          rowData.rpi_patientlname.toLowerCase().includes(value.toLowerCase())
        ) {
          return rowData;
        }
      },
    },
    {
      title: "Date Admitted",
      field: "rpi_date_admitted",
      render: (rowData) => `${rowData.rpi_date_admitted.slice(0, 10)}`,
    },
    {
      title: "Time Admitted",
      field: "rpi_date_admitted",
      render: (rowData) => `${rowData.rpi_date_admitted.slice(11)}`,
    },
    {
      title: "Bed No.",
      field: "rpi_bednumber",
      render: (rowData) => `${rowData.rpi_bednumber}`,
    },
    {
      title: "Admission Status",
      field: "rpi_covid19",
      render: (rowData) => `${rowData["Admission Status"] || ""}`,
    },
    {
      title: "COVID-19 Case",
      field: "rpi_covid19",
      render: (rowData) => `${rowData["Covid Case"] || ""}`,
    },
    {
      title: "COVID-19 Diagnosis",
      field: "rpi_covid19",
      render: (rowData) => `${rowData.classification || ""}`,
    },
    {
      title: "Actions",
      field: "tabledata.id",
      sorting: false,
      render: (rowData) => (
        <IconButton
          style={{ float: "" }}
          aria-label="options"
          onClick={(e) => toggleOptions(e, rowData)}
        >
          <MoreVert />
        </IconButton>
      ),
      disableClick: true,
    },
  ];

  const renderTable = () => {
    return (
      <MaterialTable
        onRowClick={(event, rowData) => {
          history.push({ pathname: `/patient/details/${rowData.rpi_patientid}`, state: "" });
        }}
        options={{
          search: true,
        }}
        columns={columns}
        data={filteredPatients(patients)}
        title={
          <Grid container>
            <Grid item xs>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="admission-status-label">Admission Status</InputLabel>
                <Select
                  labelId="admission-status-label"
                  value={filter.admissionStatus}
                  autoWidth
                  name="admissionStatus"
                  onChange={(e) => {
                    const data = { ...filter };
                    data[e.target.name] = e.target.value;
                    setFilter(data);
                  }}
                  label="Admission Status"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {patientStatus.map((el) => {
                    if (el.rps_category === "Admission Status") {
                      return <MenuItem value={el.rps_name}>{el.rps_name}</MenuItem>;
                    }
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="covid-status-label">COVID-19 Case</InputLabel>
                <Select
                  labelId="covid-status-label"
                  value={filter.covidStatus}
                  autoWidth
                  name="covidStatus"
                  onChange={(e) => {
                    const data = { ...filter };
                    data[e.target.name] = e.target.value;
                    setFilter(data);
                  }}
                  label="COVID-19 Case"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {patientStatus.map((el) => {
                    if (el.rps_category === "Covid Case") {
                      return <MenuItem value={el.rps_name}>{el.rps_name}</MenuItem>;
                    }
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="classification-status-label">COVID-19 Diagnosis</InputLabel>
                <Select
                  labelId="classification-status-label"
                  value={filter.classificationStatus}
                  autoWidth
                  name="classificationStatus"
                  onChange={(e) => {
                    const data = { ...filter };
                    data[e.target.name] = e.target.value;
                    setFilter(data);
                  }}
                  label="COVID-19 Diagnosis"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {patientStatus.map((el) => {
                    if (el.rps_category === "Classification") {
                      return <MenuItem value={el.rps_name}>{el.rps_name}</MenuItem>;
                    }
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        }
      />
    );
  };

  return (
    <>
      <DateTimePatientCards className={classes.row} />
      <Typography className={classes.row} align="left" variant="h4">
        {ward}: COVID-19 PATIENT LIST
        {/* <IconButton aria-label="options" onClick={addMonitor}>
          <LibraryAdd />
        </IconButton> */}
      </Typography>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.root}
        spacing={3}
      >
        {/* {renderMonitors()} */}
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.root}
        spacing={3}
        style={{ marginTop: "20px" }}
      >
        <Grid item xs={12}>
          {/* TABLE */}
          <Grid container>
            <Grid align="left" xs={2} item></Grid>
            <Grid xs={7} item />
            <Grid align="right" xs={3} item></Grid>
          </Grid>
          {renderTable()}
        </Grid>
      </Grid>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeOptions}
      >
        <MenuItem onClick={updateHandler}>Edit</MenuItem>
        <MenuItem onClick={deleteHandler}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default PatientList;
