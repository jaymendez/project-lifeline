import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Pusher from "pusher-js";
import _ from "lodash";
import TelemetryCard from "./Card";

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
  TelemetryDashboard: {
    backgroundColor: "#222222",
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

  const parsePatientsOrder = () => {
    const data = [...patients];
    const sortedData = _.sortBy(data, ["monitorSection"]);
    setPatients(sortedData);
  };

  React.useEffect(() => {
    parsePatientsOrder();
  }, []);

  const pusherOptions = {
    cluster: "eu",
    // options below are needed for pusher local dev server
    encrypted: true,
    httpHost: "206.189.87.169",
    httpPort: "57003",
    wsHost: "206.189.87.169",
    wsPort: "57004",
  };
  const pusherKey = "22222222222222222222";

  var channel = "mya";
  var event = "mya";

  useEffect(() => {
    var pusher = new Pusher(pusherKey, pusherOptions);
    // start listening for events
    pusher.subscribe("mya").bind(event, function (data) {
      console.log(data);
      // for (key in data) {
      //   var value = data[key];
      //   console.log(data);
      //   document.getElementById("notification").innerHTML = data;
      // }
    });
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
        className={clsx(classes.root, classes.TelemetryDashboard)}
        spacing={3}
      >
        {placedMonitors()}
      </Grid>
    </>
  );
};

export default TelemetryDashboard;
