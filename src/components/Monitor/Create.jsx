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
  Button,
  Menu,
  MenuItem,
  TextField,
  Divider,
  Card,
  Container,
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
    margin: "25px 0px",
    float: "right",

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
        <Grid item xs={10}>
          <Typography variant="h4" style={{ float: "left",  margin: "10px 15px" }}>
            Create Monitor
          </Typography>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Divider st/>
      <Container maxWidth="md">
        <Card style={{ margin: "10px 15px", padding: "25px" }}>
          <Grid
            container
            justify="space-around"
            // alignItems="center"
            // spacing={3}
          >
            <Grid item xs={3}>
              <TextField
                id="standard-full-width"
                label="Monitor Name"
                placeholder="Input name for monitor"
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="standard-full-width"
                label="Description"
                placeholder="Input description for monitor"
                margin="normal"
                multiline
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SaveIcon />}
          >
            Submit
          </Button>
        </Card>
      </Container>
    </>
  );
};

export default Create;
