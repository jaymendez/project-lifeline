import Repository from "./Repository";

const resource = "/";

export default {
  getMonitor(monitorId) {

  },
  getMonitors() {

  },
  addMonitor() {

  },

  deleteMonitor(monitorId) {
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    Repository.post("/delete_monitor", formData);
  },

  addPatientToMonitor(patientId, monitorId) {
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    formData.append("patientid", patientId);
    Repository.post("/add_patient_toMonitor", formData);
  },

  removePatientFromMonitor(patientId, monitorId) {
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    formData.append("patientid", patientId);
    Repository.post("/remove_patient_toMonitor", formData);
  },

  incrementPatientSlot(payload) {
    const { patientSlot, monitorId } = payload;
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    formData.append("patientSlot", patientSlot + 1);
    Repository.post("/update_monitor", formData)
  },

  decrementPatientSlot(payload) {
    const { patientSlot, monitorId } = payload;
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    formData.append("patientSlot", patientSlot - 1);
    Repository.post("/update_monitor", formData);
  },
};
