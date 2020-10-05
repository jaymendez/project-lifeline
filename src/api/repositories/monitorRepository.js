import Repository from "./Repository";
import {v4 as uuid} from "uuid"

const resource = "/";

export default {
  getMonitor(monitorId) {

  },

  getMonitorWithPatient(patientId) {
    return Repository.get(`/monitorWithPatient/${patientId}`);
  },

  getMonitorsWithPatient() {
    return Repository.post("/get_monitor");
  },

  addMonitor() {
    const formData = new FormData();
    const id = uuid().slice(0,5);
    formData.append("monitorname", `Monitor-${id}`);
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

  requestBP(patientid) {
    const formData = new FormData();
    formData.append("patientid", patientid);
    return Repository.post("/requestBP", formData);
  },
  getRequestBPValue(requestid) {
    const formData = new FormData();
    formData.append("requestid", requestid);
    return Repository.post("/getRequestBPValue ", formData);
  },

  async updateMonitor(payload) {
    const { patientSlot, id: monitorId, description, name } = payload;
    const formData = new FormData();
    formData.append("monitorid", monitorId);
    formData.append("monitordesc", description);
    formData.append("monitorname", name);
    formData.append("maxslot", patientSlot);
    formData.append("wardid", 1);
    try {
      const response = await Repository.post("/update_monitor", formData);
      return response;
    } catch (e) {
      if (e) {
        return e;
      }
    }
  }
};
