import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  TablePagination,
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
  DragIndicator,
  Edit,
} from "@material-ui/icons";
import moment from "moment";
import _, { isUndefined } from "lodash";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DateTimePatientCards from "../utils/components/toolbar/DateTimePatientCards";
import Progress from "../utils/components/feedback/Progress";
import AuthDialog from "../utils/components/dialog/AuthDialog";
import { RepositoryFactory } from "../../api/repositories/RepositoryFactory";

const MonitorRepository = RepositoryFactory.get("monitor");
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

const MonitorSetup = () => {
  const classes = useStyles();
  const rowRef = useRef(null);
  const dragRef = useRef(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [monitorLoader, setMonitorLoader] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
    admissionStatus: "Active",
    covidStatus: "",
    classificationStatus: "",
  });
  const [ward, setWard] = useState("UP-PGH WARD 1");
  const [maximumSlots] = useState(6);
  const [monitors, setMonitors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientStatus, setPatientStatus] = useState([]);
  const [chosenMonitor, setChosenMonitor] = useState("");

  useEffect(() => {
    getMonitorsWithPatient();
    getPatients();
    getStatuscodes();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const getMonitorsWithPatient = async () => {
    setMonitorLoader(true);
    const { data } = await MonitorRepository.getMonitorsWithPatient();
    const updatedMonitor = data.map((el) => {
      let { patientIds, ...data } = el;
      if (_.isEmpty(patientIds)) {
        patientIds = [];
      } else {
        patientIds = JSON.parse(patientIds);
      }
      return {
        ...data,
        patientIds,
      };
    });
    setMonitors(updatedMonitor);
    setMonitorLoader(false);
    // console.log(updatedMonitor);
  };

  const getPatients = async () => {
    const { data } = await PatientRepository.getPatients();
    const parsedData = data.getpatientlist_report.map((el) => {
      const { rpi_patientid: id, ...patient } = el;
      const name = `${patient.rpi_patientfname} ${patient.rpi_patientlname}`;
      return {
        id,
        name,
        ...patient,
      };
    });
    // console.log(parsedData);
    setPatients(parsedData);
  };

  const addMonitor = async () => {
    // const updateMonitors = [...monitors];
    // const newMonitor = {
    //   id: 0,
    //   patients: [],
    //   patientIds: [],
    //   patientSlot: 0,
    // };
    // const highestId = Math.max.apply(
    //   Math,
    //   updateMonitors.map(function (o) {
    //     return o.id;
    //   })
    // );
    // newMonitor.id = highestId + 1;
    // updateMonitors.push(newMonitor);
    // setMonitors(updateMonitors);
    const res = await MonitorRepository.addMonitor();
    getMonitorsWithPatient();
  };

  const deleteMonitor = async (monitorId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        const res = await MonitorRepository.deleteMonitor(monitorId);
        getMonitorsWithPatient();
      }
    });
    // const res = await MonitorRepository.deleteMonitor(monitorId);
    // getMonitorsWithPatient();
  };

  const addPatientSlot = async (monitorId) => {
    const updateMonitors = _.cloneDeep(monitors);
    const index = _.findIndex(updateMonitors, function (o) {
      return o.id === monitorId;
    });
    const monitor = updateMonitors[index];
    if (monitor.patientSlot < 6) {
      // monitor.patientSlot++;
    } else {
      /* maximum patient slot */
      return;
    }
    // console.log(updateMonitors);
    // setMonitors(updateMonitors);
    const res = await MonitorRepository.incrementPatientSlot(monitor);
    getMonitorsWithPatient();
  };

  const deletePatientSlot = async (monitorId, patientId) => {
    /*
      if patientId exists, user deleted an occupied slot
      if patientId is null, user deleted an empty patient slot
    */
    const updateMonitors = _.cloneDeep(monitors);
    const index = _.findIndex(updateMonitors, function (o) {
      return o.id === monitorId;
    });
    if (index >= 0) {
      const { patientIds } = updateMonitors[index];
      if (patientId) {
        const patientIndex = patientIds.indexOf(patientId);
        if (patientIndex >= 0) {
          MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            // onClose: () => {
            //   getMonitorsWithPatient();
            // },
          }).then(async (result) => {
            if (result.value) {
              await MonitorRepository.removePatientFromMonitor(patientId, monitorId);
              getMonitorsWithPatient();
            }
          });
          // await MonitorRepository.removePatientFromMonitor(patientId, monitorId);
        }
      } else {
        // Deduct patientSlot
        // updateMonitors[index].patientSlot--;
        MySwal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
          // onClose: () => {
          //   getMonitorsWithPatient();
          // },
        }).then(async (result) => {
          if (result.value) {
            // await MonitorRepository.removePatientFromMonitor(patientId, monitorId);
            await MonitorRepository.decrementPatientSlot(updateMonitors[index]);
            getMonitorsWithPatient();
          }
        });
        // await MonitorRepository.decrementPatientSlot(updateMonitors[index]);
      }
    }
    // getMonitorsWithPatient();
    // setMonitors(updateMonitors);
  };

  const onDragEnd = async (result) => {
    setMonitorLoader(true);
    const el = rowRef.current;
    if (!el) {
      return;
    }
    console.log("on dragend");
    el.style.width = "5%";
    // el.style.border = "";
    // console.log(el);
    const response = {
      success: 0,
      errors: [],
    };
    const { source, destination, draggableId } = result;
    let patientId = draggableId.split("-")[1];
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    let { droppableId: sourceMonitorId } = source;
    let { droppableId: destinationMonitorId } = destination;
    if (sourceMonitorId.indexOf("-") >= 0) {
      sourceMonitorId = parseInt(sourceMonitorId.slice(sourceMonitorId.indexOf("-") + 1), 10);
    }
    if (destinationMonitorId.indexOf("-") >= 0) {
      destinationMonitorId = destinationMonitorId.split("-")[1];
    }

    // const updateMonitors = _.cloneDeep(monitors);
    const updateMonitors = [...monitors];
    const sourceIndex = _.findIndex(updateMonitors, function (o) {
      return o.id === sourceMonitorId;
    });
    const sourceMonitor = updateMonitors[sourceIndex];

    const destinationIndex = _.findIndex(updateMonitors, function (o) {
      return o.id === destinationMonitorId;
    });
    const destinationMonitor = updateMonitors[destinationIndex];

    if (source.droppableId === destination.droppableId) {
      // Do nothing, no reorder.
      return;
    } else if (destination.droppableId === "drop-table") {
      // Move to table, from monitor
      /* remove from monitor */
      const patientIndex = sourceMonitor.patientIds.indexOf(patientId);
      if (patientIndex >= 0) {
        // sourceMonitor.patientIds.splice(patientIndex, 1);
        await MonitorRepository.removePatientFromMonitor(patientId, sourceMonitorId);
      }
    } else if (source.droppableId === "drop-table") {
      // Move from table, to monitor
      /* add to monitor */
      // will push patient_id to monitor.patientIds
      // destinationMonitor.patientIds.push(patientId);
      if (destinationMonitor.patientSlot <= destinationMonitor.patientIds.length) {
        response.errors.push("Monitor destination has no slot left.");
        return;
      }
      if (destinationMonitor.patientIds.length > 6) {
        response.errors.push("Monitor destination is full.");
        return;
      }
      await MonitorRepository.addPatientToMonitor(patientId, destinationMonitorId);
    } else {
      if (destinationMonitor.patientSlot <= destinationMonitor.patientIds.length) {
        response.errors.push("Monitor destination has no slot left.");
        return;
      }
      if (destinationMonitor.patientIds.length > 6) {
        response.errors.push("Monitor destination is full.");
        return;
      }
      /* Move patient to other monitors */
      /* add to monitor destination, remove from monitor source */
      await MonitorRepository.addPatientToMonitor(patientId, destinationMonitorId);
      await MonitorRepository.removePatientFromMonitor(patientId, sourceMonitorId);
      // const patientindex = sourceMonitor.patientIds.indexOf(patientId);
      // sourceMonitor.patientIds.splice(patientindex, 1);
      // destinationMonitor.patientIds.push(patientId);
    }
    if (response.errors.length === 0) {
      // await MonitorRepository.addPatientToMonitor(patientId, destinationMonitorId);
      // setMonitors(updateMonitors);
    }
    await getMonitorsWithPatient();
    setMonitorLoader(false);
  };

  const renderPatients = (monitorIndex) => {
    const { patientSlot, id: monitorId } = monitors[monitorIndex];
    // const patientSlot = monitors[monitorIndex].patientIds.length
    const patientsComponent = [];
    for (let i = 0; i <= patientSlot - 1; i++) {
      // const patient = monitors[monitorIndex]["patients"][i];
      // if (_.isEmpty(monitors[monitorIndex].patientIds)) continue;

      const patientId = monitors[monitorIndex].patientIds[i];
      // if (_.isEmpty(patientId)) {
      //   continue;
      // }
      // console.log(patientId);
      const patientIndex = _.findIndex(patients, function (o) {
        return o.id === patientId;
      });
      const patient = patients[patientIndex];
      if (patient) {
        patientsComponent.push(
          <Draggable key={`key-${patientId}`} draggableId={`${patientId}`} index={patientId}>
            {(provided, snapshot) => (
              <Grid
                item
                xs="6"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Card
                  variant="outlined"
                  className={patient ? classes.occupied : classes.empty}
                  style={{ backgroundColor: "#5c5c5c" }}
                >
                  <Grid alignItems="center" container>
                    <Grid align="right" item xs>
                      <IconButton
                        size="small"
                        onClick={() => deletePatientSlot(monitorId, patientId)}
                      >
                        <Close style={{ fontSize: "14px", color: "#ffffff" }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <CardContent className={classes.cardContent}>
                    <Typography
                      className={classes.whiteText}
                      style={patient ? { fontWeight: "bold" } : {}}
                    >
                      {patient?.name || "ADD PATIENT"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Draggable>
        );
      } else {
        patientsComponent.push(
          <Grid item xs="6">
            <Card
              variant="outlined"
              className={patient ? classes.occupied : classes.empty}
              style={{ backgroundColor: "#5c5c5c" }}
            >
              <Grid alignItems="center" container>
                <Grid align="right" item xs>
                  <IconButton size="small" onClick={() => deletePatientSlot(monitorId, null)}>
                    <Close style={{ fontSize: "14px", color: "#ffffff" }} />
                  </IconButton>
                </Grid>
              </Grid>
              <CardContent className={classes.cardContent}>
                <Typography
                  className={classes.whiteText}
                  style={patient ? { fontWeight: "bold" } : {}}
                >
                  {patient?.name || "ADD PATIENT"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      }
    }
    const emptySlots = maximumSlots - patientSlot;
    // console.log(emptySlots);
    for (let i = 0; i <= emptySlots - 1; i++) {
      patientsComponent.push(
        <Grid item xs="6" className={classes.invisible}>
          <Card variant="outlined" className={classes.empty} style={{ backgroundColor: "#5c5c5c" }}>
            <Grid alignItems="center" container>
              <Grid align="right" item xs>
                <Close style={{ fontSize: "14px", color: "#ffffff" }} />
              </Grid>
            </Grid>
            <CardContent className={classes.cardContent}>
              <Typography className={classes.whiteText}>ADD PATIENT--</Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    }
    return patientsComponent;
  };

  const renderMonitors = () => {
    let monitorsData = [...monitors];
    monitorsData = monitorsData.filter((el) => el.patientSlot <= 6);
    return monitorsData.map((el, i) => {
      const { patientSlot } = el;
      return (
        <Grid item xs={4}>
          <Typography align="left" variant="h5">
            {/* Monitor
            {el.id} */}
            {el.name}
            <IconButton aria-label="edit-monitor" onClick={(e) => editMonitorForm(el)}>
              <Edit style={{ marginTop: -5 }} />
            </IconButton>
          </Typography>
          <Droppable droppableId={`monitor-${el.id}`}>
            {(provided, snapshot) => (
              <Card
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={classes.paper}
                style={
                  snapshot.isDraggingOver
                    ? { backgroundColor: "skyblue" }
                    : { backgroundColor: "#5c5c5c" }
                }
              >
                <Grid alignItems="center" container>
                  <Grid align="left" item xs>
                    <IconButton aria-label="options" onClick={() => addPatientSlot(el.id)}>
                      <LibraryAdd className={classes.whiteText} />
                    </IconButton>
                  </Grid>
                  <Grid align="right" item xs>
                    <IconButton aria-label="options" onClick={() => deleteMonitor(el.id)}>
                      <Close className={classes.whiteText} />
                    </IconButton>
                  </Grid>
                </Grid>
                <CardContent>
                  <Grid spacing={1} alignItems="center" container>
                    {renderPatients(i)}
                    {provided.placeholder}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Droppable>
        </Grid>
      );
    });
  };

  const filterPatients = () => {
    const keyword = filter.search;
    let patientIds = monitors.map((el) => {
      return el.patientIds;
    });
    patientIds = patientIds.flat();
    let filteredPatients = patients.filter((el) => {
      if (patientIds.indexOf(el.id) >= 0) {
      } else {
        return el;
      }
    });
    filteredPatients = filteredPatients.filter((el) => {
      if (el.rpi_patientfname.toLowerCase().includes(keyword)) {
        return el;
      }
      if (el.rpi_patientlname.toLowerCase().includes(keyword)) {
        return el;
      }
    });
    if (filter.admissionStatus) {
      filteredPatients = filteredPatients.filter((el) => {
        return el["Admission Status"] === filter.admissionStatus;
      });
    }
    if (filter.covidStatus) {
      filteredPatients = filteredPatients.filter((el) => {
        return el["Covid Case"] === filter.covidStatus;
      });
    }
    if (filter.classificationStatus) {
      filteredPatients = filteredPatients.filter((el) => {
        return el.classification === filter.classificationStatus;
      });
    }
    return filteredPatients;
  };

  const renderTable = () => {
    let filteredPatients = filterPatients();
    filteredPatients = filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    console.log(filteredPatients);
    return (
      <TableContainer component={Paper}>
        <Droppable droppableId="drop-table">
          {(provided, snapshot) => (
            <Table
              style={snapshot.isDraggingOver ? { backgroundColor: "skyblue" } : {}}
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={classes.table}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Date Admitted</TableCell>
                  <TableCell align="center">Time Admitted</TableCell>
                  <TableCell align="center">Bed No.</TableCell>
                  <TableCell align="center">Admission Status</TableCell>
                  <TableCell align="center">COVID-19 Case</TableCell>
                  <TableCell align="center">COVID-19 Diagnosis</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((row, index) => (
                  /* sol 1 */
                  <TableRow key={row.name}>
                    <Draggable
                      // key={"draggableKey-" + index}
                      key={`key-${row.id}`}
                      draggableId={`table-${row.id}`}
                      // draggableId={row.id}
                      // index={`table-${row.id}`}
                      index={row.id}
                    >
                      {(draggableProvided, draggableSnapshot) => (
                        <>
                          <TableCell
                            ref={(node) => {
                              rowRef.current = node;
                              draggableProvided.innerRef(node);
                            }}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            scope="row"
                          >
                            {draggableSnapshot.isDragging ? (
                              <TableCell
                                // ref={rowRef}
                                scope="row"
                                style={{
                                  border: "1px solid #4ba2e7",
                                  backgroundColor: "#4ba2e7",
                                  width: "inherit",
                                }}
                              >
                                <Grid alignItems="center" container style={{ width: "300px" }}>
                                  <Grid item xs={3}>
                                    <Person style={{ marginRight: 15, color: "white" }} />
                                  </Grid>
                                  <Grid item xs>
                                    <Typography style={{ color: "white" }}>{row.name}</Typography>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            ) : (
                              <DragIndicator />
                            )}
                          </TableCell>
                        </>
                      )}
                    </Draggable>
                    <TableCell component="th">{row.name}</TableCell>

                    <TableCell align="center">{row.rpi_date_admitted.slice(0, 10)}</TableCell>
                    <TableCell align="center">{row.rpi_date_admitted.slice(11)}</TableCell>
                    <TableCell align="center">Bed #{row.rpi_bednumber}</TableCell>
                    <TableCell align="center">{row["Admission Status"] || ""}</TableCell>
                    <TableCell align="center">{row["Covid Case"] || ""}</TableCell>
                    <TableCell align="center">{row.classification || ""}</TableCell>
                  </TableRow>
                  /* end sol 1 */
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </TableContainer>
    );
  };
  const onBeforeCapture = (event) => {
    const el = rowRef.current;
    el.style.border = 0;
    if (!el) {
      return;
    }
    // el.style.width = "10%";
    // el.style.width = "500px";
  };

  const editMonitorForm = async (monitor) => {
    const updatedMonitor = { ...monitor };
    const { value } = await MySwal.fire({
      title: "Monitor Name",
      input: "text",
      inputValue: monitor.name,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "The monitor name required";
        }
        if (value === monitor.name) {
          return "The monitor name must be different";
        }
      },
    });
    if (value) {
      updatedMonitor.name = value;
      const data = await MonitorRepository.updateMonitor(updatedMonitor);
      if (data.status === 200) {
        MySwal.fire({
          icon: "success",
          title: "Monitor updated.",
          showConfirmButton: true,
          onClose: () => getMonitorsWithPatient(),
        });
      } else {
        MySwal.fire({
          icon: "warning",
          text: "Error encountered with the request.",
          showConfirmButton: true,
          // onClose: () => getMonitorsWithPatient(),
        });
      }
    }
  };

  return (
    <>
      {/* <AuthDialog /> */}
      <DateTimePatientCards className={classes.row} />
      <Typography className={classes.row} align="left" variant="h4">
        {ward}: COVID-19 PATIENT LIST
        <IconButton aria-label="options" onClick={addMonitor}>
          <LibraryAdd />
        </IconButton>
      </Typography>
      <DragDropContext onBeforeCapture={onBeforeCapture} onDragEnd={onDragEnd}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.root}
          spacing={3}
          style={{ display: "relative" }}
        >
          {/* <Progress open={true}/> */}
          <CircularProgress
            style={monitorLoader ? { display: "absolute", zIndex: "999" } : { display: "none" }}
          />
          {/* <CircularProgress /> */}
          {/* {!monitorLoader ? renderMonitors() : null} */}
          {renderMonitors()}
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
            <Grid container spacing={0}>
              <Grid align="left" xs={2} item>
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
              <Grid align="left" xs={2} item>
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
              <Grid align="left" xs={2} item>
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
              <Grid xs={3} item />
              <Grid align="right" xs={3} item>
                <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
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
                </FormControl>
              </Grid>
            </Grid>
            {renderTable()}
          </Grid>
        </Grid>
      </DragDropContext>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filterPatients().length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default MonitorSetup;
