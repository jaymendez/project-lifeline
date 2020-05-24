import Repository from "./Repository";

const resource = "/";

export default {
  getPatientClassification() {
    return Repository.get("/filter_statuscode?statuscode=PATIENT CLASSIFICATION");
  },
  getPatientCovidCase() {
    return Repository.get("/filter_statuscode?statuscode=PATIENT COVID CASE");
  },
};
