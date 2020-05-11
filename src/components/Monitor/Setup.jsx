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
import _ from "lodash";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DateTimePatientCards from "../utils/components/toolbar/DateTimePatientCards";
import AuthDialog from "../utils/components/dialog/AuthDialog";

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
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Patient 1",
      monitor: 1,
      monitorSection: 6,
    },
    {
      id: 2,
      name: "Patient 2",
      monitor: 1,
      monitorSection: 4,
    },
    {
      id: 4,
      name: "Fourth Pateint",
      monitor: 1,
      monitorSection: 1,
    },
    {
      id: 5,
      name: "Fifth Patient",
      monitor: 1,
      monitorSection: 2,
    },
    {
      id: 3,
      name: "Third boii",
      monitor: 1,
      monitorSection: 2,
    },
    {
      id: 10,
      name: "the tenth",
      monitor: 1,
      monitorSection: 2,
    },
    {
      id: 11,
      name: "X1 Boys",
      monitor: 1,
      monitorSection: 2,
    },
  ]);

  const addMonitor = () => {
    const updateMonitors = [...monitors];
    const newMonitor = {
      id: 0,
      patients: [],
      patientIds: [],
      patientSlot: 0,
    };
    const highestId = Math.max.apply(
      Math,
      updateMonitors.map(function (o) {
        return o.id;
      })
    );
    newMonitor.id = highestId + 1;
    updateMonitors.push(newMonitor);
    setMonitors(updateMonitors);
  };

  const deleteMonitor = (monitorId) => {
    const updateMonitors = [...monitors];
    const index = _.findIndex(updateMonitors, function (o) {
      return o.id === monitorId;
    });
    updateMonitors.splice(index, 1);
    setMonitors(updateMonitors);
  };

  const addPatientSlot = (monitorId) => {
    const updateMonitors = _.cloneDeep(monitors);
    const index = _.findIndex(updateMonitors, function (o) {
      return o.id === monitorId;
    });
    const monitor = updateMonitors[index];
    if (monitor.patientSlot < 6) {
      monitor.patientSlot++;
    } else {
      /* maximum patient slot */
    }
    console.log(updateMonitors);
    setMonitors(updateMonitors);
  };

  const deletePatientSlot = (monitorId, patientId) => {
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
          patientIds.splice(patientIndex, 1);
        }
      } else {
        updateMonitors[index].patientSlot--;
      }
    }
    setMonitors(updateMonitors);
  };

  const onDragEnd = (result) => {
    const response = {
      success: 0,
      errors: [],
    };
    const { source, destination, draggableId } = result;
    let patientId = parseInt(draggableId, 10);
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
      destinationMonitorId = parseInt(
        destinationMonitorId.slice(destinationMonitorId.indexOf("-") + 1),
        10
      );
    }
    if (draggableId.indexOf("-") >= 0) {
      patientId = parseInt(draggableId.slice(draggableId.indexOf("-") + 1), 10);
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
      // Move to table
      const patientIndex = sourceMonitor.patientIds.indexOf(patientId);
      if (patientIndex >= 0) {
        sourceMonitor.patientIds.splice(patientIndex, 1);
      }
    } else if (source.droppableId === "drop-table") {
      // Move from table
      // will push patient_id to monitor.patientIds
      destinationMonitor.patientIds.push(patientId);
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
      const patientindex = sourceMonitor.patientIds.indexOf(patientId);
      sourceMonitor.patientIds.splice(patientindex, 1);
      destinationMonitor.patientIds.push(patientId);
    }
    if (response.errors.length === 0) {
      setMonitors(updateMonitors);
    }
  };

  const renderPatients = (monitorIndex) => {
    const { patientSlot, id: monitorId } = monitors[monitorIndex];
    // const patientSlot = monitors[monitorIndex].patientIds.length
    const patientsComponent = [];
    for (let i = 0; i <= patientSlot - 1; i++) {
      // const patient = monitors[monitorIndex]["patients"][i];
      const patientId = monitors[monitorIndex].patientIds[i];
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
              <Typography className={classes.whiteText}>ADD PATIENT</Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    }
    return patientsComponent;
  };

  const renderMonitors = () => {
    return monitors.map((el, i) => {
      return (
        <Grid item xs={4}>
          <Typography align="left" variant="h5">
            Monitor
            {el.id}
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
                      <Close className={classes.whiteText} onClick={() => deleteMonitor(el.id)} />
                    </IconButton>
                  </Grid>
                </Grid>
                <CardContent>
                  <Grid

                    spacing={1}
                    alignItems="center"
                    container
                  >
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
    let patientIds = monitors.map(el => {
      return el.patientIds;
    });
    patientIds = patientIds.flat();
    const filteredPatients = patients.filter(el => {
      if (patientIds.indexOf(el.id) >= 0) {

      }  else {
        return el;
      }
    });
    return filteredPatients;
  };

  const renderTable = () => {
    const filteredPatients = filterPatients();
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
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Date Admitted</TableCell>
                  <TableCell align="center">Time Admitted</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Device</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredPatients.map((row, index) => (
                  <Draggable
                    // key={"draggableKey-" + index}
                    key={`key-${row.id}`}
                    draggableId={`table-${row.id}`}
                    // draggableId={row.id}
                    // index={`table-${row.id}`}
                    index={row.id}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <TableRow
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        key={row.name}
                      >
                        {console.log(draggableProvided.innerRef)}
                        {draggableSnapshot.isDragging ? (
                          <TableCell
                            component="th"
                            scope="row"
                            ref={rowRef}
                            style={{ border: "1px solid #4ba2e7", backgroundColor: "#4ba2e7" }}
                          >
                            <Grid alignItems="center" container>
                              <Grid item xs={3}>
                                <Person style={{ marginRight: 15, color: "white" }} />
                              </Grid>
                              <Grid item xs>
                                <Typography style={{ color: "white" }}>{row.name}</Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                        ) : (
                          <>
                            <TableCell ref={rowRef} component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="center">SAMPLE DATE</TableCell>
                            <TableCell align="center">SAMPLE TIME</TableCell>
                            <TableCell align="center">SAMPLE Location</TableCell>
                            <TableCell align="center">
                              <div style={{ backgroundColor: "#4ba2e7", color: "white" }}>
                                STABLE
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <div style={{ backgroundColor: "#ebebeb" }}>RX BOX</div>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton style={{ float: "right" }} aria-label="options">
                                <MoreVert />
                              </IconButton>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                      // </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </TableContainer>
    );
  };
  let isDrag = false;
  const onBeforeCapture = event => {
    // document.body.style.color = "orange";
    // document.body.style.width = "200px";
    isDrag = true;
  }

  return (
    <>
      <AuthDialog />
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
        >
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
            <Grid container>
              <Grid align="left" xs={2} item>
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
                    <MenuItem value={10}>Stable or No co morbid</MenuItem>
                    <MenuItem value={20}>Stable or unstable co morbid</MenuItem>
                    <MenuItem value={30}>CAP-HR, sepsis, or shock</MenuItem>
                    <MenuItem value={40}>ARDS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={7} item />
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
    </>
  );
};

export default PatientList;
