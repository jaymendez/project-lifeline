import Repository from "./Repository";

const resource = "/";

export default {
  validatePassword({password}) {
    const formData = new FormData();
    formData.append("password", password);
    return Repository.post(`/checkpassword`, formData);
  }
};
