import Repository from "./Repository";

const resource = "/";

export default {
  createWard(payload) {
    const formData = new FormData();
    for (let [key, value] of Object.entries(payload)) {
      if (typeof value === "undefined") {
        value = "";
      }
      formData.append(key, value);
    }
    Repository.post("/create_ward", formData);
  },
  updateWard(payload) {
    const formData = new FormData();
    for (let [key, value] of Object.entries(payload)) {
      if (typeof value === "undefined") {
        value = "";
      }
      formData.append(key, value);
    }
    Repository.post("/update_ward", formData);
  },
  deleteWard(wardId) {
    const formData = new FormData();
    formData.append("wardid", wardId);
    Repository.post("/delete_ward", formData);
  }
};
