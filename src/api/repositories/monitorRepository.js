import Repository from "./Repository";

const resource = "/";

export default {
  getMonitor(monitorId) {

  },
  getMonitorsWithPatient() {
    return Repository.post("/get_monitor");
  },

  addMonitor() {
    const formData = new FormData();
    formData.append("monitorname", "");
    formData.append("monitordesc", "");
    formData.append("wardid", 1);
    formData.append("maxslot", 0);
    return Repository.post("/create_monitor", formData);
  },

  deleteMonitor(monitorId) {
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    return Repository.post("/delete_monitor", formData);
  },

  addPatientToMonitor(patientId, monitorId) {
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    formData.append("slotnumber", 1);
    formData.append("patientid", patientId);
    return Repository.post("/add_patient_toMonitor", formData);
  },

  removePatientFromMonitor(patientId, monitorId) {
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    formData.append("patientid", patientId);
    return Repository.post("/remove_patient_toMonitor", formData);
  },

  incrementPatientSlot(payload) {
    const { patientSlot, id: monitorId, description, name } = payload;
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    formData.append("monitordesc", description);
    formData.append("monitorname", name);
    formData.append("maxslot", patientSlot + 1);
    formData.append("wardid", 1);

    return Repository.post("/update_monitor", formData)
  },

  decrementPatientSlot(payload) {
    const { patientSlot, id: monitorId, description, name } = payload;
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    formData.append("monitordesc", description);
    formData.append("monitorname", name);
    formData.append("maxslot", patientSlot - 1);
    formData.append("wardid", 1);
    return Repository.post("/update_monitor", formData);
  },
};
