import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import PieChart from "../utils/components/charts/PieChart";
import LineChart from "../utils/components/charts/LineChart";
import BarChart from "../utils/components/charts/BarChart";
import dummyPatients from "../utils/components/charts/patients-data.json";
import dummyCases from "../utils/components/charts/bar-cases.json";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  modPaper: {
    padding: theme.spacing(3, 2),
    height: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

const Home = () => {
  const classes = useStyles();
  const [summaryCases, setSummaryCases] = useState([]);
  const [time, setTime] = useState();

  const clock = () => {
    setInterval(() => {
      const timeString = new Date().toLocaleTimeString("en-US");
      setTime(timeString);
    }, 1000);
  };

  useEffect(() => {
    clock();
  });

  const dateTime = () => {
    return (
      <Grid container justify="center" alignItems="center" style={{ height: "100%" }}>
        <Grid item xs={12}>
          <Paper className={classes.paper} style={{ padding: "4px 10px" }}>
            <Typography align="left" variant="h5" style={{ fontWeight: 600 }}>
              DATE:
            </Typography>
            <Typography align="left" variant="h5">
              {moment().format("YYYY-MM-DD")}
            </Typography>
          </Paper>
          <br />
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper} style={{ padding: "4px 10px" }}>
            <Typography align="left" variant="h5" style={{ fontWeight: 600 }}>
              TIME:
            </Typography>
            <Typography align="left" variant="h5">
              {/* {moment().format("HH:mm:ss")} */}
              {time}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          {/* CARDS */}
          <Grid container spacing={4}>
            <Grid item xs>
              {dateTime()}
            </Grid>
            <Grid item xs>
              <Paper
                className={classes.modPaper}
                style={{ border: "solid 2px #e04040", color: "#f74e4e", height: "100%" }}
              >
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                  CONFIRMED CASES
                </Typography>
                <Typography variant="h2">150</Typography>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper
                className={classes.modPaper}
                style={{ border: "solid 2px #1d5f98", color: "#1d5f98", height: "100%" }}
              >
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                  PROBABLE CASES
                </Typography>

                <Typography variant="h2">200</Typography>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper
                className={classes.modPaper}
                style={{ border: "solid 2px #1d5f98", color: "#1d5f98", height: "100%" }}
              >
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                  SUSPECTED CASES
                </Typography>

                <Typography variant="h2">200</Typography>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper
                className={classes.modPaper}
                style={{ border: "solid 2px #3d98e6", color: "#3d98e6", height: "100%" }}
              >
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                  DISCHARGED
                </Typography>

                <Typography variant="h2">75</Typography>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper
                className={classes.modPaper}
                style={{ border: "solid 2px #000000", color: "#000000", height: "100%" }}
              >
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                  DEATHS
                </Typography>

                <Typography variant="h2">200</Typography>
              </Paper>
            </Grid>
          </Grid>
          {/* Charts */}
          <Grid container style={{ marginTop: "25px" }}>
            <Grid item xs={12}>
              <Paper className={classes.paper} style={{ height: "600px" }}>
                {/* <h1>GRAPH</h1> */}
                <Typography className={classes.row} align="left" variant="h4">
                  PHILIPPINE GENERAL HOSPITAL: COVID-19 CASES
                </Typography>
                {/* <LineChart /> */}
                <BarChart data={dummyCases} />
              </Paper>
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: "25px" }}>
            <Grid item xs={12}>
              <Paper className={classes.paper} style={{ height: "600px" }}>
                {/* <h1>GRAPH</h1> */}
                <Typography className={classes.row} align="left" variant="h4">
                  CLASSIFIED COVID-19 PATIENTS
                </Typography>
                <BarChart data={dummyPatients} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing="3">
            <Grid item xs={12}>
              <Paper className={classes.paper} style={{ height: "450px" }}>
                <Typography component="span" variant="h4">
                  TOTAL AVAILABLE BEDS
                </Typography>
                <Divider variant="middle" />
                <PieChart />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper} style={{ height: "450px" }}>
                {/* <h1>GRAPH</h1> */}
                <Typography component="span" variant="h4">
                  GENDER
                </Typography>
                <Divider variant="middle" />
                <PieChart />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper} style={{ height: "450px" }}>
                {/* <h1>GRAPH</h1> */}
                <Typography component="span" variant="h4">
                  TOTAL ADMINISTERED TESTS
                </Typography>
                <Divider variant="middle" />
                <PieChart />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
