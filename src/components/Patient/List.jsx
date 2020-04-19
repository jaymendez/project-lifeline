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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
}));

function createData(id, name, calories, fat, carbs, protein) {
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData(1, "Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData(2, "Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData(3, "Eclair", 262, 16.0, 24, 6.0),
  createData(4, "Cupcake", 305, 3.7, 67, 4.3),
  createData(5, "Gingerbread", 356, 16.0, 49, 3.9),
];

const PatientList = () => {
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
  const classes = useStyles();

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
                      <IconButton size="small" onClick={() => deletePatientSlot(monitorId, patientId)}>
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
          <Card className={classes.paper} style={{ backgroundColor: "#5c5c5c" }}>
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
              <Droppable droppableId={`monitor-${el.id}`}>
                {(provided) => (
                  <Grid
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    spacing={1}
                    alignItems="center"
                    container
                  >
                    {renderPatients(i)}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </Grid>
      );
    });
  };

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
    console.log(result);
    const response = {
      success: 0,
      errors: [],
    };
    const { source, destination, draggableId } = result;
    let patientId = draggableId;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    let { droppableId: sourceMonitorId } = source;
    let { droppableId: destinationMonitorId } = destination;
    if (sourceMonitorId.indexOf("-") >= 0) {
      sourceMonitorId = sourceMonitorId.slice(sourceMonitorId.indexOf("-") + 1);
    }
    if (destinationMonitorId.indexOf("-") >= 0) {
      destinationMonitorId = parseInt(destinationMonitorId.slice(destinationMonitorId.indexOf("-") + 1), 10);
    }
    if (draggableId.indexOf("-") >= 0) {
      patientId = parseInt(draggableId.slice(draggableId.indexOf("-") + 1), 10);
    }

    const updateMonitors = _.cloneDeep(monitors);

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
    }
    else {
      /* Move patient to other monitors */
      const patientindex = sourceMonitor.patientIds.indexOf(patientId);
      sourceMonitor.patientIds.splice(patientindex, 1);

      if (destinationMonitor.patientSlot !== destinationMonitor.patientIds.length + 1) {
        response.errors.push("Monitor destination has no slot left.");
      }
      if (destinationMonitor.patientIds.length > 6) {
        response.errors.push("Monitor destination is full.");
      }
      destinationMonitor.patientIds.push(patientId);
    }
    if (response.errors.length === 0) {
      setMonitors(updateMonitors);
    }
  };

  return (
    <>
      <DateTimePatientCards className={classes.row} />
      <Typography className={classes.row} align="left" variant="h4">
        {ward}: COVID-19 PATIENT LIST
        <IconButton aria-label="options" onClick={addMonitor}>
          <LibraryAdd />
        </IconButton>
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
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
        >
          <Grid item xs={12}>
            {/* TABLE */}
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
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
                <Droppable droppableId="drop-table">
                  {(provided) => (
                    <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                      {patients.map((row, index) => (
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
                              {draggableSnapshot.isDragging ? (
                                <TableCell component="th" scope="row">
                                  {row.name}
                                </TableCell>
                              ) : (
                                <>
                                  <TableCell component="th" scope="row">
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
                  )}
                </Droppable>
              </Table>
            </TableContainer>

            {/* <Paper className={classes.paper}>
              <h1>GRAPH</h1>
            </Paper> */}
          </Grid>
        </Grid>
      </DragDropContext>
    </>
  );

  // return (
  //   <>
  //     <Grid
  //       container
  //       direction="row"
  //       justify="center"
  //       alignItems="center"
  //       className={classes.root}
  //       spacing={3}
  //     >
  //       <Grid container justify="center" alignItems="center" item spacing={4} xs={7}>
  //
  //         <Grid item container justify="center" alignItems="center" xs={12}>
  //           <Grid item xs={10}>
  //             <Typography style={{ float: "left", paddingLeft: "16px" }} variant="h5">
  //               PHILIPPINE GENERAL HOSPITAL: COVID 19 PATIENT LIST
  //             </Typography>
  //           </Grid>
  //           <Grid item xs={2}>
  //             <IconButton style={{ float: "right" }} aria-label="settings">
  //               <Settings />
  //             </IconButton>
  //           </Grid>
  //         </Grid>
  //         <Grid item xs={12}>
  //           {/* TABLE */}
  //           <TableContainer component={Paper}>
  //             <Table className={classes.table} aria-label="simple table">
  //               <TableHead>
  //                 <TableRow>
  //                   <TableCell>Name</TableCell>
  //                   <TableCell align="center">Date Admitted</TableCell>
  //                   <TableCell align="center">Time Admitted</TableCell>
  //                   <TableCell align="center">Location</TableCell>
  //                   <TableCell align="center">Device</TableCell>
  //                   <TableCell align="center">Actions</TableCell>
  //                 </TableRow>
  //               </TableHead>
  //               <TableBody>
  //                 {rows.map((row) => (
  //                   <TableRow key={row.name}>
  //                     <TableCell component="th" scope="row">
  //                       {row.name}
  //                     </TableCell>
  //                     <TableCell align="center">{row.calories}</TableCell>
  //                     <TableCell align="center">{row.fat}</TableCell>
  //                     <TableCell align="center">{row.carbs}</TableCell>
  //                     <TableCell align="center">
  //                       <div style={{ backgroundColor: "#ebebeb" }}>RX BOX</div>
  //                     </TableCell>
  //                     <TableCell align="center">
  //                       <IconButton style={{ float: "right" }} aria-label="options">
  //                         <MoreVert />
  //                       </IconButton>
  //                     </TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </TableContainer>
  //           {/* <Paper className={classes.paper}>
  //             <h1>GRAPH</h1>
  //           </Paper> */}
  //         </Grid>
  //       </Grid>
  //       <Grid container justify="center" alignItems="center" item spacing={1} xs={5}>
  //         <Grid item xs={12}>
  //           <Paper className={classes.paper}>
  //             <h1>GRAPH</h1>
  //           </Paper>
  //         </Grid>
  //         <Grid item xs={12}>
  //           <Paper className={classes.paper}>
  //             <h1>GRAPH</h1>
  //           </Paper>
  //         </Grid>
  //       </Grid>
  //     </Grid>
  //   </>
  // );
};

export default PatientList;
