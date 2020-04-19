import React from "react";
import { Link } from "react-router-dom"
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
  Button,
  Menu,
  MenuItem,
  Divider
} from "@material-ui/core";
import { Save as SaveIcon, Add, MoreVert } from "@material-ui/icons";
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
  button: {
    margin: theme.spacing(1),
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

const Create = () => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const toggleMenuAnchor = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenuAnchor = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        className={classes.root}
        spacing={3}
      >
        <Grid item xs>
          <Typography variant="h3" style={{ float: "left" }}>
            Monitor Settings
          </Typography>
        </Grid>
        <Grid item xs>
          <Link to="/monitor/create">
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              style={{ float: "right" }}
              startIcon={<Add />}
              >
              Add Monitor
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Divider />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Monitor ID</TableCell>
              <TableCell align="center">Monitor Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Patient Count</TableCell>
              <TableCell align="center">Status</TableCell>
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
                  <IconButton style={{ float: "right" }} aria-label="options" onClick={toggleMenuAnchor}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        id="monitor-menu"
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={closeMenuAnchor}
      >
        <MenuItem onClick={closeMenuAnchor}>Profile</MenuItem>
        <MenuItem onClick={closeMenuAnchor}>My account</MenuItem>
        <MenuItem onClick={closeMenuAnchor}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default Create;
