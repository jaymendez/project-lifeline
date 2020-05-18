import React, { useState, useEffect } from "react";
import { Grid, Typography, Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DateRange, Alarm, Person } from "@material-ui/icons";
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
  card: {
    maxWidth: 340,
  },
}));

const DateTimePatientCards = () => {
  const classes = useStyles();
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
  return (
    <div>
      <Grid container direction="row" className={classes.root} spacing={1}>
        <Grid item xs={3}>
          <Card className={classes.card} variant="outlined">
            <CardContent>
              <Grid alignItems="center" container>
                <Grid item xs>
                  <Typography align="left" variant="h4">
                    DATE:
                  </Typography>
                  <Typography align="left" variant="h5">
                    {" "}
                    {moment().format("YYYY-MM-DD")}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <DateRange style={{ fontSize: "36px", float: "right" }} />
                </Grid>
              </Grid>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card} variant="outlined">
            <CardContent>
              <Grid alignItems="center" container>
                <Grid item xs>
                  <Typography align="left" variant="h4">
                    TIME:
                  </Typography>
                  <Typography align="left" variant="h5">
                    {" "}
                    {time}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Alarm style={{ fontSize: "36px", float: "right" }} />
                </Grid>
              </Grid>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.card} variant="outlined">
            <CardContent>
              <Grid alignItems="center" container>
                <Grid item xs>
                  <Typography align="left" variant="h4">
                    PATIENTS:
                  </Typography>
                  <Typography align="left" variant="h5">
                    {" "}
                    {150}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Person style={{ fontSize: "36px", float: "right" }} />
                </Grid>
              </Grid>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default DateTimePatientCards;
