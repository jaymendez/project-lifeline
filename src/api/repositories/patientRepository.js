import Repository from "./Repository";
import _ from "lodash";

const resource = "/";

export default {
  // http://206.189.87.169/PatientFullDetails/patientid
  getPatient(patientId) {
    return Repository.get(`/PatientFullDetails/${patientId}`);
  },
  getPatients() {
    return Repository.get(`/getpatientlist`);
  },
  createPatient(payload) {
    return Repository.post(`/addpatientapi`, payload);
  },
  deletePatient(id) {
    const formData = new FormData();
    formData.append("patientid", id);
    return Repository.post(`/deletePatient`, formData);
  },
  updatePatient(payload) {
    return Repository.post(`/updatePatient`, payload);
  },
  getPatientConfig(id) {
    return Repository.get(`/PatientConfig/${id}`);
  },
  addPatientConfig(payload) {
    const formData = new FormData();
    for (let [key, value] of Object.entries(payload)) {
      if (typeof value === "undefined") {
        value = "";
      }
      if (typeof value === "string") {
        value = value.trim();
      }
      formData.append(key, value);
    }
    return Repository.post(`/addPatientConfig`, formData);
  },
  createDefaultPatientConfig(patientId) {
    const defaultConfig = {
      ecg_st_msec: "",
      heartrate_upper_bpm: 100,
      heartrate_lower_bpm: 50,
      pulserate_upper_bpm: 100,
      pulserate_lower_bpm: 50,
      oxygen_upper_saturation: 100,
      oxygen_lower_saturation: 94,
      respiratory_upper_rpm: 20,
      respiratory_lower_rpm: 12,
      bp_systolic_upper: 120,
      bp_systolic_lower: 90,
      bp_diastolic_upper: 80,
      bp_diastolic_lower: 60,
      bp_time_frame: 30,
      temperature_upper: 42.0,
      temperature_lower: 35.8,
    };
    this.addPatientConfig({ patientid: patientId, ...defaultConfig });
  },
  getPatientObservation(payload) {
    const formData = new FormData();
    for (let [key, value] of Object.entries(payload)) {
      if (typeof value === "undefined") {
        value = "";
      }
      if (typeof value === "string") {
        value = value.trim();
      }
      formData.append(key, value);
    }
    return Repository.post(`/getPatientRangedObservation`, formData);
  },

  getLivePatientObservation() {
    return Repository.get(`/getPatientObservation`);
  },
  
  async getAllObservation(payload) {
    const observationList = [
      {
        id: "heart_rate",
        name: "HEART RATE",
        legend: "HR",
        code: "76282-3",
      },
      {
        id: "pulse_rate",
        name: "PULSE RATE",
        legend: "PR",
        code: "8889-8",
      },
      {
        id: "spo2",
        name: "SPO2",
        legend: "%",
        code: "59407-7",
      },
      {
        id: "respiratory_rate",
        name: "RESPIRATORY RATE",
        legend: "RR",
        code: "76270-8",
      },
      {
        name: "BLOOD PRESSURE",
        data: [
          {
            legend: "SYSTOLIC",
            code: "8480-6",
          },
          {
            legend: "DIASTOLIC",
            code: "8462-4",
          },
        ],
      },
      {
        id: "map",
        legend: "MAP",
        code: "8478-0",
      },
      {
        id: "temperature",
        name: "TEMPERATURE",
        legend: "CELSIUS",
        code: "8310-5",
      },
    ];
    console.log('test');
    const tableData = {
      "00": {key: "00", time: "12:00 AM"},
      "01": {key: "01", time: "1:00 AM"},
      "02": {key: "02", time: "2:00 AM"},
      "03": {key: "03", time: "3:00 AM"},
      "04": {key: "04", time: "4:00 AM"},
      "05": {key: "05", time: "5:00 AM"},
      "06": {key: "06", time: "6:00 AM"},
      "07": {key: "07", time: "7:00 AM"},
      "08": {key: "08", time: "8:00 AM"},
      "09": {key: "09", time: "9:00 AM"},
      10: {key: "10", time: "10:00 AM"},
      11: {key: "11", time: "11:00 AM"},
      12: {key: "12", time: "12:00 PM"},
      13: {key: "13", time: "1:00 PM"},
      14: {key: "14", time: "2:00 PM"},
      15: {key: "15", time: "3:00 PM"},
      16: {key: "16", time: "4:00 PM"},
      17: {key: "17", time: "5:00 PM"},
      18: {key: "18", time: "6:00 PM"},
      19: {key: "19", time: "7:00 PM"},
      20: {key: "20", time: "8:00 PM"},
      21: {key: "21", time: "9:00 PM"},
      22: {key: "22", time: "10:00 PM"},
      23: {key: "23", time: "11:00 PM"},
    };
    const { spec_date, patientid } = payload;
    await Promise.all(observationList.map(async el => {
      const formData = new FormData();
      formData.append("spec_date", spec_date);
      formData.append("patientid", patientid);
      if (!_.isEmpty(el.code)) {
        formData.append("obscode", el.code);
        const { data } = await Repository.post(`/getPatientRangedObservation`, formData);
        const obs = data.PatientRangedObservation;
        // let updatedTableData = _.cloneDeep(tableData);

        obs.map(e => {
          tableData[e.hour_clustered] = Object.assign(tableData[e.hour_clustered], {[el.id]: e.avg_value});
        });
      }
    }));
    const updatedTableData = Object.values(tableData);
    const parsedData = _.sortBy(updatedTableData, [function(o) { return o.key; }]);
    return parsedData;
  }
};
