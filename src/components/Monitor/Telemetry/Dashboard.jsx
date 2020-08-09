import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Pusher from "pusher-js";
import _ from "lodash";
import moment from "moment";
import TelemetryCard from "./Card";
import { RepositoryFactory } from "../../../api/repositories/RepositoryFactory";

const MonitorRepository = RepositoryFactory.get("monitor");
const PatientRepository = RepositoryFactory.get("patient");

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
  const [refreshInterval] = useState(60);
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

  const getMonitorWithPatientId = async () => {
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
    }
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
    const now = moment();
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
    if (data.length) {
      const rxbox = data.filter((el) => {
        if (Array.isArray(patientId)) {
          if (patientId.indexOf(el.tpo_subject) >= 0) {
            if (validateRxboxData(el)) {
              return el;
            }
          }
        } else if (el.tpo_subject === patientId) {
          if (validateRxboxData(el)) {
            return el;
          }
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
    setTimeout(function () {
      // window.location.reload();
      getMonitorWithPatientId();
    }, refreshInterval * 1000);
  };

  const initPusher = () => {
    const pusherOptions = {
      cluster: "eu",
      // options below are needed for pusher local dev server
      encrypted: false,
      httpHost: DOMAIN,
      httpPort: process.env.REACT_APP_PUSHER_HTTP_PORT,
      wsHost: DOMAIN,
      wsPort: process.env.REACT_APP_PUSHER_WS_PORT,
    };
    const pusherKey = process.env.REACT_APP_PUSHER_KEY;

    var channel = process.env.REACT_APP_PUSHER_CHANNEL;
    var event = process.env.REACT_APP_PUSHER_EVENT;

    var pusher = new Pusher(pusherKey, pusherOptions);
    // start listening for events
    pusher.subscribe(channel).bind(event, function (data) {
      const d = JSON.parse(data);
      const parsedData = d.patientBasicObservation.map((el) => {
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
    });
  };

  useEffect(() => {
    initPusher();
    getMonitorWithPatientId();
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
      if (patientIds.length) {
        for (let index = 0; index < 6; index++) {
          let paper = "";
          const patientId = patientIds[index];
          const patientIndex = _.findIndex(patients, function (e) {
            return e.rpi_patientid === patientId;
          });
          const patient = patients[patientIndex];
          // console.log(patient);
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
