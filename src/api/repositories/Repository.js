import axios from "axios";

const baseDomain =
  process.env.REACT_APP_ENV === "LOCAL"
    ? process.env.REACT_APP_LOCAL
    : window.location.origin;

const baseURL = process.env.REACT_APP_LIFELINE_BACKEND_URL || `${baseDomain}/api`;

export default axios.create({
  baseURL,
});
