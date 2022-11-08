import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { io } from "socket.io-client";
import _ from "lodash";
import moment from "moment";
import TelemetryCard from "./Card";
import { RepositoryFactory } from "../../../api/repositories/RepositoryFactory";

const MonitorRepository = RepositoryFactory.get("monitor");
const PatientRepository = RepositoryFactory.get("patient");
const RXBOX_INTERVAL = 60000;
let RXBOX_DATA = [];

const DOMAIN =
  process.env.REACT_APP_ENV === "LOCAL"
    ? process.env.REACT_APP_LOCAL.replace(/(^\w+:|^)\/\//, "")
    : process.env.REACT_APP_STAGING.replace(/(^\w+:|^)\/\//, "");

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
    position: "fixed",
    padding: 0,
    margin: 0,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
}));

const TelemetryDashboard = (props) => {
  const { match } = props;
  const classes = useStyles();
  const [rxboxData, setRxboxData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [monitor, setMonitor] = useState({});
  const [refreshInterval] = useState(30);
  const [code] = useState({
    ecg: "76282-3",
    spo2: "59407-7",
    primary_rr: "76270-8",
    secondary_rr: "76171-8",
    temp: "8310-5",
    hr: "76282-3",
    pr: "8889-8",
    bp: "131328",
    systolic_bp: "8480-6",
    diastolic_bp: "8462-4",
    mean_arterial_pressure: "8478-0",
  });

  const getMonitorWithPatientId = () => {
    return new Promise(async (resolve, reject) => {
      if (!_.isEmpty(match.params)) {
        const { data } = await MonitorRepository.getMonitorWithPatient(match.params.id);
        const updatedMonitor = data.map((el) => {
          let { patientIds, ...data } = el;
          if (_.isEmpty(patientIds)) {
            patientIds = [];
          } else {
            patientIds = JSON.parse(patientIds);
          }
          return {
            ...data,
            patientIds,
          };
        });
        setMonitor(updatedMonitor[0]);
        resolve(updatedMonitor[0]);
      }
    });
  };

  const getPatient = async (id) => {
    const result = {
      success: 0,
      data: "",
      error: "",
    };
    if (id) {
      /* Query to get patient */
      try {
        const { data } = await PatientRepository.getPatient(id);
        // setPatient(data.PatientData_report[0]);
        return data.PatientData_report[0];
        // result.success = 1;
        // result.data = data;
      } catch (e) {
        // alert("no patient with that id");
        result.error = e;
        // console.log(e);
      }
    } else {
      result.error = "Missing id argument";
    }
    // return result;
  };

  const getPatients = async () => {
    if (!_.isEmpty(monitor)) {
      const { patientIds } = monitor;
      if (patientIds.length) {
        const patientsData = await Promise.all(
          patientIds.map((el) => {
            const patient = getPatient(el);

            return patient;
          })
        );
        setPatients(patientsData);
      }
    }
  };
  const validateRxboxData = (data) => {
    if (_.isEmpty(data.tpo_value)) {
      return false;
    }
    if (!_.isEmpty(data.tpo_dataerror)) {
      return false;
    }
    const now = moment.utc();
    const effectiveDate = moment.utc(data.tpo_effectivity);
    const diff = now.diff(effectiveDate) / 1000;
    if (
      data.tpo_code === code.systolic_bp ||
      data.tpo_code === code.diastolic_bp ||
      data.tpo_code === code.mean_arterial_pressure
    ) {
      if (diff >= 3600) {
        return false;
      }
    } else if (diff >= 30) {
      return false;
    }
    return true;
  };

  const getPatientRxboxData = (patientId) => {
    const data = [...rxboxData];
    console.log("getPatientRxboxData", data);
    if (data.length) {
      const rxbox = data.filter((el) => {
        if (Array.isArray(patientId)) {
          if (patientId.indexOf(el.tpo_subject + "") >= 0) {
            return el;
            // if (validateRxboxData(el)) {
            // }
            // console.log(false, "----validate----");
          }
        } else if ((el.tpo_subject + "") === patientId) {
          return el;
          // if (validateRxboxData(el)) {
          // }
          // console.log(false, "----validate----");
        }
      });
      return rxbox;
    }
  };

  const parsePatientsOrder = () => {
    const data = [...patients];
    const sortedData = _.sortBy(data, ["monitorSection"]);
    setPatients(sortedData);
  };

  const autoRefresh = () => {
    setInterval(function () {
      // window.location.reload();
      getMonitorWithPatientId();
    }, refreshInterval * 1000);
  };

  const getPatientObservation = async () => {
    const { data, status } = await PatientRepository.getLivePatientObservation();
    if (status === 200) {
      const [obs, notifs] = data;
      const observations = obs.patientBasicObservation;
      const parsedData = observations.map((el) => {
        const {
          tpo_subject,
          tpo_code,
          tpo_value,
          tpo_dataerror,
          tpo_effectivity,
          ...restData
        } = el;
        const parsedSubject = parseInt(tpo_subject.slice(tpo_subject.search("/") + 1), 10);
        return {
          tpo_subject: parsedSubject,
          tpo_code,
          tpo_value,
          tpo_dataerror,
          tpo_effectivity,
        };
      });
      setRxboxData(parsedData);
      RXBOX_DATA = parsedData;
    }
  };

  const getPatientObservationTest = async () => {
    const val = moment.utc().format("ss") % 2 === 1 ? "90" : "25";
    const data = [
      {
        /* spo2 */
        tpo_code: "59407-7",
        tpo_dataerror: "",
        tpo_effectivity: moment.utc(),
        tpo_obsid: 704894,
        tpo_subject: 63,
        tpo_value: val
      },
      {
        /* pulse rate */
        tpo_code: "8889-8",
        tpo_dataerror: "",
        tpo_effectivity: moment.utc(),
        tpo_obsid: 704894,
        tpo_subject: 63,
        tpo_value: val
      },
      {
        /* systolic bp */
        tpo_code: "8480-6",
        tpo_dataerror: "",
        tpo_effectivity: moment.utc(),
        tpo_obsid: 704894,
        tpo_subject: 63,
        tpo_value: val
      },
      {
        /* diastolic bp */
        tpo_code: "8462-4",
        tpo_dataerror: "",
        tpo_effectivity: moment.utc(),
        tpo_obsid: 704894,
        tpo_subject: 63,
        tpo_value: val
      },
      {
        /* diastolic bp */
        tpo_code: "8478-0",
        tpo_dataerror: "",
        tpo_effectivity: moment.utc(),
        tpo_obsid: 704894,
        tpo_subject: 63,
        tpo_value: val
      },
      {
        /* primary rr */
        tpo_code: "76270-8",
        tpo_dataerror: "",
        tpo_effectivity: moment.utc(),
        tpo_obsid: 704894,
        tpo_subject: 63,
        tpo_value: val
      },
      {
        /* temp */
        tpo_code: "8310-5",
        tpo_dataerror: "",
        tpo_effectivity: moment.utc(),
        tpo_obsid: 704894,
        tpo_subject: 63,
        tpo_value: val
      },
    ];
    setRxboxData(data);
    // return data;
  };

  const initPusher = (rxboxDataState, monitorDataState) => {

    let event = process.env.REACT_APP_PUSHER_EVENT;
    let url = (process.env.REACT_APP_LIFELINE_BACKEND_URL ? process.env.REACT_APP_LIFELINE_BACKEND_URL.replace("/api", "") : null) || (window.location.origin).replace("/api", "") || `http://localhost:3000`;

    let socket = io(url, {
      query: {
        monitor: monitorDataState.name
      }
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully.');
    });

    socket.on(event, (args, _callback) => {
      const d = args;
      console.log("PUSHER DATA", d);
      let parsedData = d.patientBasicObservation.map((el) => {
        const {
          tpo_subject,
          tpo_code,
          tpo_value,
          tpo_dataerror,
          tpo_effectivity,
          ...restData
        } = el;
        const parsedSubject = parseInt(tpo_subject.slice(tpo_subject.search("/") + 1), 10);
        return {
          tpo_subject: parsedSubject,
          tpo_code,
          tpo_value,
          tpo_dataerror,
          tpo_effectivity,
        };
      });

      if (RXBOX_DATA.length > 0) {
        let parsedData2 = RXBOX_DATA.map(el1 => parsedData.find(el2 => el2.tpo_subject === el1.tpo_subject && el2.tpo_code === el1.tpo_code && moment(el2.tpo_effectivity) > moment(el1.tpo_effectivity)) || el1);
        
        parsedData.forEach(data1 => {
          let patientDataExist = false;
          RXBOX_DATA.forEach(data2 => {

            if (data1.tpo_subject === data2.tpo_subject && data1.tpo_code === data2.tpo_code) {
              patientDataExist = true;
            }

            
          });
          if (patientDataExist == false) {
            parsedData2.push(data1);
          }
        });
        
        RXBOX_DATA = parsedData2;
        setRxboxData(parsedData2);
        console.log("PUSHER UPDATED", parsedData2);
      } else {
        console.log("PUSHER FAILED TO UPDATE");
      }
    });

    socket.connect();
    console.log('Establishing socket connection...');

  };

  useEffect(() => {
    // setInterval(getPatientObservationTest, RXBOX_INTERVAL);
    getMonitorWithPatientId().then(monitorReturn => {
      getPatientObservation();
      setInterval(getPatientObservation, RXBOX_INTERVAL);
      initPusher(rxboxData, monitorReturn);
    });
    autoRefresh();
  }, []);

  useEffect(() => {
    getPatients();
  }, [monitor]);

  useEffect(() => {
    // getPatientRxboxData([8, 9]);
  }, [rxboxData]);

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

  const renderPatients = () => {
    const patientCards = [];
    if (!_.isEmpty(monitor)) {
      const { patientIds } = monitor;
      if (patientIds.length && patients.length) {
        for (let index = 0; index < 6; index++) {
          let paper = "";
          const patientId = patientIds[index];
          const patientIndex = _.findIndex(patients, function (e) {
            return e.rpi_patientid === patientId;
          });
          const patient = patients[patientIndex];
          let rxboxData = getPatientRxboxData(patientId);
          if (!_.isEmpty(patient)) {
            paper = <TelemetryCard patient={patient} rxbox={rxboxData} />;
          }
          patientCards.push(
            <Grid key={`card-${index}`} item xs={6}>
              {paper}
            </Grid>
          );
        }
      }
    }
    return patientCards;
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
        {renderPatients()}
        {/* {placedMonitors()} */}
      </Grid>
    </>
  );
};

export default TelemetryDashboard;
