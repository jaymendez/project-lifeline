import React from "react";
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
import { Settings, MoreVert } from "@material-ui/icons";
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
  table: {
    minWidth: 650,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const List = () => {
  const classes = useStyles();

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
        <Grid container justify="center" alignItems="center" item spacing={4} xs={7}>
          <Grid container justify="center" alignItems="center" item spacing={2} xs={12}>
            <Grid item xs>
              <Paper className={classes.paper}>
                <Typography variant="h4">DATE:</Typography>
                <Typography variant="h5"> {moment().format("YYYY-MM-DD")}</Typography>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper className={classes.paper}>
                <Typography variant="h4">TIME:</Typography>
                <Typography variant="h5">{moment().format("HH:mm:ss")}</Typography>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper className={classes.paper}>
                <Typography variant="h4">PATIENTS</Typography>
                <Typography variant="h5">150</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Grid item container justify="center" alignItems="center" xs={12}>
            <Grid item xs={10}>
              <Typography style={{ float: "left", paddingLeft: "16px" }} variant="h5">
                PHILIPPINE GENERAL HOSPITAL: COVID 19 PATIENT LIST
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <IconButton style={{ float: "right" }} aria-label="settings">
                <Settings />
              </IconButton>
            </Grid>
          </Grid>
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
                    <TableCell align="center">Device</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.calories}</TableCell>
                      <TableCell align="center">{row.fat}</TableCell>
                      <TableCell align="center">{row.carbs}</TableCell>
                      <TableCell align="center">
                        <div style={{ backgroundColor: "#ebebeb" }}>RX BOX</div>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton style={{ float: "right" }} aria-label="options">
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <Paper className={classes.paper}>
              <h1>GRAPH</h1>
            </Paper> */}
          </Grid>
        </Grid>
        <Grid container justify="center" alignItems="center" item spacing={1} xs={5}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <h1>GRAPH</h1>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <h1>GRAPH</h1>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default List;
