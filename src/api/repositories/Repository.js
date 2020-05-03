import axios from "axios";

const baseDomain = "http://206.189.87.169";
const baseURL = `${baseDomain}`;

export default axios.create({
  baseURL,
});
