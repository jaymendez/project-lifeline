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
  }
};
