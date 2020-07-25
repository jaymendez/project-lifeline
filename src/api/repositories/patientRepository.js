import Repository from "./Repository";

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
};
