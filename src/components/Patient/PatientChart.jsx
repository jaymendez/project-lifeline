import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Divider,
  Paper,
  InputAdornment,
  IconButton,
  Button,
} from "@material-ui/core";
import _ from "lodash";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { ResponsiveLine } from "@nivo/line";
import { makeStyles } from "@material-ui/core/styles";
import { RepositoryFactory } from "../../api/repositories/RepositoryFactory";

const PatientRepository = RepositoryFactory.get("patient");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(4),
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
    width: "80%",
  },
  detailsKey: {
    marginRight: 20,
  },
}));

const PatientChart = (props) => {
  const classes = useStyles();
  const { observation, patientId, style } = props;
  const [observationType] = useState(observation.name);
  const [observationData, setObservationData] = useState([]);
  const [dateFilter, setDateFilter] = useState(moment().format("YYYY-MM-DD"));
  const [timeCoverage] = useState(24);
  const [chartProps, setChartProps] = useState({});

  

  const getPatientObservation = async (data) => {
    let { obscode, spec_date, patientid } = data;
    if (_.isEmpty(spec_date)) {
      spec_date = moment().format("YYYY-MM-DD");
    }
    // console.log(_.isEmpty(patientid));
    if (!patientid) {
      return;
    }

    if (!_.isEmpty(obscode.code)) {
      try {
        const params = { obscode: obscode.code, spec_date, patientid };
        const { data: result } = await PatientRepository.getPatientObservation(params);
        const response = result.PatientRangedObservation;
        const len = [...Array(timeCoverage + 1).keys()].slice(1, timeCoverage + 1);
        const obs = len.map((el) => {
          const index = _.findIndex(response, function (o) {
            return parseInt(o.hour_clustered, 10) === el;
          });
          let val = 0;
          if (index >= 0) {
            val = response[index].avg_value.toFixed(3);
          }
          return {
            x: `${el}:00`,
            y: val,
          };
        });
        setObservationData([
          {
            id: obscode.legend,
            color: "hsl(110, 70%, 50%)",
            data: obs,
          },
        ]);
      } catch (e) {
        console.log(e);
      }
    } else {
      // Blood Pressure
      const obsBP = obscode.data;
      const responseBP = await Promise.all(
        obsBP.map(async (el) => {
          const params = {
            obscode: el.code,
            spec_date,
            patientid,
          };
          const { data: result } = await PatientRepository.getPatientObservation(params);
          const response = result.PatientRangedObservation;

          const len = [...Array(timeCoverage + 1).keys()].slice(1, timeCoverage + 1);
          const obs = len.map((el) => {
            const index = _.findIndex(response, function (o) {
              return parseInt(o.hour_clustered, 10) === el;
            });
            let val = 0;
            if (index >= 0) {
              val = response[index].avg_value.toFixed(3);
            }
            return {
              x: `${el}:00`,
              y: val,
            };
          });
          return {
            id: el.legend,
            color: "hsl(110, 70%, 50%)",
            data: obs,
          };
        })
      );
      const newProps = {
        areaOpacity: 0.75,
      };
      setChartProps(newProps);
      setObservationData(responseBP);
    }
  };

  useEffect(() => {
    getPatientObservation({
      obscode: observation,
      spec_date: dateFilter,
      patientid: patientId,
    });
  }, []);

  useEffect(() => {
    getPatientObservation({
      obscode: observation,
      spec_date: dateFilter,
      patientid: patientId,
    });
  }, [dateFilter, patientId]);

  return (
    <Paper elevation={3} className={classes.paper} style={{ ...style }}>
      <Grid container spacing={3}>
        <Grid item xs={4} align="left">
          <Typography variant="h4">{observationType}</Typography>
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={2}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              margin="dense"
              // error={errors.birthdate}
              inputVariant="outlined"
              disableFuture
              clearable
              // value={selectedDate}
              // placeholder="10/10/2018"
              name="birthdate"
              value={dateFilter}
              // onChange={(date) => {
              //   patientHandler(null, { key: "birthdate", value: date });
              //   // setBirthdate(date.format("YYYY-MM-DD"));
              // }}
              onChange={(date) => {
                setDateFilter(date.format("YYYY-MM-DD"));
              }}
              format="MM/DD/YYYY"
              // minDate={new Date()}
              // format="MM/dd/yyyy"
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid xs={12}>
          <div style={{ width: "100%", height: "600px" }}>
            <ResponsiveLine
              enableArea
              data={observationData}
              margin={{ top: 100, right: 100, bottom: 75, left: 60 }}
              // margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: "point" }}
              {...chartProps}
              yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: "bottom",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Time",
                legendOffset: 36,
                legendPosition: "middle",
              }}
              // axisLeft={{
              //   orient: "left",
              //   tickSize: 5,
              //   tickPadding: 5,
              //   tickRotation: 0,
              //   legend: "count",
              //   legendOffset: -40,
              //   legendPosition: "middle",
              // }}
              colors={{ scheme: "nivo" }}
              pointSize={10}
              // pointColor={{ theme: "background" }}
              pointColor={{ theme: "labels.text.fill" }}
              pointBorderWidth={2}
              // pointBorderColor={{ from: "serieColor" }}
              pointBorderColor={{ from: "serieColor", modifiers: [] }}
              pointLabel="y"
              pointLabelYOffset={-12}
              useMesh
              // curve="natural"
              enableSlices="x"
              // theme={{
              //   tooltip: {
              //     container: {
              //       background: "#333",
              //     },
              //   },
              // }}
              // tooltip={({ id, value, color }) => {
              //   console.log(color);
              //   console.log('test');
              //   return (<strong style={{ color }}>
              //     {id}: {value}
              //   </strong>)
              // }}
              sliceTooltip={({ slice }) => {
                console.log("test", slice);
                return (
                  <div
                    style={{
                      background: "white",
                      padding: "9px 12px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <strong>{slice.points[0].data.x}</strong>
                    </div>
                    {slice.points.map((point) => (
                      <Grid
                        container
                        key={point.id}
                        style={{
                          // color: point.serieColor,
                          padding: "3px 0",
                        }}
                      >
                        <Grid item xs>
                          <span
                            style={{
                              display: "initial",
                              color: point.serieColor,
                              paddingRight: "10px",
                              float: "left",
                            }}
                          >
                            <strong>{point.serieId}</strong>
                            {":"}
                          </span>
                        </Grid>
                        <Grid item xs>
                          <span style={{ display: "initial", float: "right" }}>
                            {point.data.yFormatted}
                          </span>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                );
              }}
              curve="catmullRom"
              legends={[
                {
                  anchor: "top",
                  direction: "row",
                  justify: false,
                  translateX: -20,
                  translateY: -30,
                  itemsSpacing: 40,
                  itemDirection: "left-to-right",
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: "circle",
                  symbolBorderColor: "rgba(0, 0, 0, .5)",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemBackground: "rgba(0, 0, 0, .03)",
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PatientChart;
