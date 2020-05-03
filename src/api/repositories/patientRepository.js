import Repository from "./Repository";

const resource = "/";

export default {
  getPatient(patientId) {
    return Repository.get(`/Patient/${patientId}`);
  },
  getPatients() {
    return Repository.get(`/getpatientlist`);
  },
  createPatient(payload) {
    return Repository.post(`/addpatientapi`, payload);
  },
};
