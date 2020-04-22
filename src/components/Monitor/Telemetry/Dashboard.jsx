import React, { useState } from "react";
import TelemetryCard from "./Card";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";

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
}));

const TelemetryDashboard = () => {
  const classes = useStyles();
  const [patients, setPatients] = useState([
    {
      name: "Sample Name",
      monitor: 1,
      monitorSection: 6,
    },
    {
      name: "Sample Name",
      monitor: 1,
      monitorSection: 4,
    },
    {
      name: "Sample Name",
      monitor: 1,
      monitorSection: 1,
    },
    {
      name: "Sample Name",
      monitor: 1,
      monitorSection: 2,
    },
  ]);
  /*
  * | | *
  * | | *

  */

  const parsePatientsOrder = () => {
    const data = [...patients];
    const sortedData = _.sortBy(data, ["monitorSection"]);
    setPatients(sortedData);
  };

  React.useEffect(() => {
    parsePatientsOrder();
  }, []);

  const placedMonitors = () => {
    const monitors = [];
    for (let index = 0; index < 6; index++) {
      let paper = "";
      const doesMonitorExist = _.findIndex(patients, function (e) {
        return e.monitorSection - 1 === index;
      });
      if (doesMonitorExist >= 0) {
        paper = <TelemetryCard />;
      }
      monitors.push(
        <Grid item xs={6}>
          {paper}
        </Grid>
      );
    }
    return monitors;
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.root}
        spacing={3}
      >
        {placedMonitors()}
      </Grid>
    </>
  );
};

export default TelemetryDashboard;
