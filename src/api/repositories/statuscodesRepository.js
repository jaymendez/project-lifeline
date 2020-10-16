import Repository from "./Repository";

const resource = "/";

export default {
  getPatientClassification() {
    return Repository.get("/filter_statuscode?statuscode=Classification");
  },
  getPatientCovidCase() {
    return Repository.get("/filter_statuscode?statuscode=Covid Case");
  },
  getPatientAdmissionStatus() {
    return Repository.get("/filter_statuscode?statuscode=Admission Status");
  },
  getAllStatus() {
    return Repository.get("/statuscodes/all");
  }
};
