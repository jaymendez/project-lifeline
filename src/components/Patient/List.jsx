import React, { useState, useEffect } from "react";
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
import DateTimePatientCards from "../utils/components/toolbar/DateTimePatientCards";
import MaterialTable from "../utils/components/table/MaterialTable";
import { MTableToolbar } from "material-table";
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
}));

function createData(id, name, calories, fat, carbs, protein) {
  return { id, name, calories, fat, carbs, protein };
}

const PatientList = () => {
  const classes = useStyles();
  const [filter, setFilter] = useState({
    search: "",
    patientStatus: "",
  });
  const [ward, setWard] = useState("UP-PGH WARD 1");
  const [maximumSlots] = useState(6);
  const [monitors, setMonitors] = useState([
    {
      id: 1,
      patients: [],
      patientIds: [1, 2],
      patientSlot: 5,
    },
    { id: 3, patients: [], patientIds: [4, 5], patientSlot: 3 },
    { id: 5, patients: [], patientIds: [3], patientSlot: 3 },
  ]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const getPatients = async () => {
      const result = await PatientRepository.getPatients();
      setPatients(result.data.getpatientlist_report);
    };

    getPatients();
  }, []);

  const filteredPatients = () => {
    const data = [...patients];
    if (filter.patientStatus) {
      return data.filter((el) => {
        return el.rpi_covid19 === filter.patientStatus;
      });
    }
    return data;
  };

  const renderTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Date Admitted</TableCell>
              <TableCell align="center">Time Admitted</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Status</TableCell>
              {/* <TableCell align="center">Device</TableCell> */}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((row, index) => (
              <TableRow key={row.name}>
                <>
                  <TableCell component="th" scope="row">
                    {row.rpi_patientfname}
                    {row.rpi_patientlname}
                  </TableCell>
                  <TableCell align="center">{row.rpi_date_admitted}</TableCell>
                  <TableCell align="center">{row.rpi_date_admitted}</TableCell>
                  <TableCell align="center">WARD #</TableCell>
                  <TableCell align="center">
                    <div style={{ backgroundColor: "#4ba2e7", color: "white" }}>
                      {row.rpi_covid19}
                    </div>
                  </TableCell>
                  {/* <TableCell align="center">
                    <div style={{ backgroundColor: "#ebebeb" }}>RX BOX</div>
                  </TableCell> */}
                  <TableCell align="center">
                    <IconButton style={{ float: "right" }} aria-label="options">
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  const columns = [
    {
      title: "Name",
      field: "name",
      render: (rowData) => `${rowData.rpi_patientfname} ${rowData.rpi_patientlname}`,
    },
    {
      title: "Date Admitted",
      field: "rpi_date_admitted",
      render: (rowData) => `${rowData.rpi_date_admitted}`,
    },
    {
      title: "Time Admitted",
      field: "rpi_date_admitted",
      render: (rowData) => `${rowData.rpi_date_admitted}`,
    },
    {
      title: "Bed No.",
      field: "name",
      render: (rowData) => `2`,
    },
    {
      title: "Status",
      field: "name",
      render: (rowData) => `${rowData.rpi_covid19}`,
    },
    {
      title: "Actions",
      field: "tabledata.id",
      render: (rowData) => (
        <IconButton style={{ float: "" }} aria-label="options">
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  const renderTable2 = () => {
    return (
      <MaterialTable
        options={{
          search: true,
        }}
        columns={columns}
        data={filteredPatients(patients)}
        title={(
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="patient-status-label">Patient Status</InputLabel>
            <Select
              labelId="patient-status-label"
              value={filter.patientStatus}
              autoWidth
              name="patientStatus"
              onChange={(e) => {
                const data = { ...filter };
                data[e.target.name] = e.target.value;
                setFilter(data);
              }}
              label="Patient Status"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Stable or No co morbid"}>Stable or No co morbid</MenuItem>
              <MenuItem value={"Stable or unstable co morbid"}>
                Stable or unstable co morbid
              </MenuItem>
              <MenuItem value={"CAP-HR, sepsis, or shock"}>CAP-HR, sepsis, or shock</MenuItem>
              <MenuItem value={"ARDS"}>ARDS</MenuItem>
            </Select>
          </FormControl>
        )}
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
            <Grid align="left" xs={2} item>
              {/* <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="patient-status-label">Patient Status</InputLabel>
                <Select
                  labelId="patient-status-label"
                  value={filter.patientStatus}
                  autoWidth
                  name="patientStatus"
                  onChange={(e) => {
                    const data = { ...filter };
                    data[e.target.name] = e.target.value;
                    setFilter(data);
                  }}
                  label="Patient Status"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Stable or No co morbid</MenuItem>
                  <MenuItem value={20}>Stable or unstable co morbid</MenuItem>
                  <MenuItem value={30}>CAP-HR, sepsis, or shock</MenuItem>
                  <MenuItem value={40}>ARDS</MenuItem>
                </Select>
              </FormControl> */}
            </Grid>
            <Grid xs={7} item />
            <Grid align="right" xs={3} item>
              {/* <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                <OutlinedInput
                  id="search-table"
                  value={filter.search}
                  onChange={(e) => {
                    const data = { ...filter };
                    data[e.target.name] = e.target.value;
                    setFilter(data);
                  }}
                  name="search"
                  endAdornment={
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  }
                  aria-describedby="search-table"
                  inputProps={{
                    "aria-label": "search",
                  }}
                  labelWidth={0}
                  fullWidth
                />
              </FormControl> */}
            </Grid>
          </Grid>
          {renderTable2()}
        </Grid>
      </Grid>
    </>
  );
};

export default PatientList;
