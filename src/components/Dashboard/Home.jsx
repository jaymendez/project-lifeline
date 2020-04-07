import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const Home = () => {
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.root}
        spacing={4}
      >
        <Grid container justify="center" alignItems="center" item spacing={4} xs={8}>
          <Grid container item xs spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <span>DATE:</span>
                <br />
                {moment().format("YYYY-MM-DD")}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <span>TIME:</span>
                <br />
                {moment().format("HH:mm:ss")}
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper} style={{ color: "#f74e4e", height: "100%" }}>
              <Typography variant="h2">150</Typography>CONFIRMED CASES
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper} style={{ color: "#1d5f98", height: "100%" }}>
              <Typography variant="h2">200</Typography>PUI
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper} style={{ color: "#3d98e6", height: "100%" }}>
              <Typography variant="h2">75</Typography>DISCHARGED
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper} style={{ color: "#000000", height: "100%" }}>
              <Typography variant="h2">200</Typography>DEATHS
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}><h1>GRAPH</h1></Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}><h1>GRAPH</h1></Paper>
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={4}>
          <Grid item xs={12}>
            <Paper className={classes.paper}><h1>GRAPH</h1></Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}><h1>GRAPH</h1></Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}><h1>GRAPH</h1></Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
