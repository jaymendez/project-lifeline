import axios from "axios";

const baseDomain =
  process.env.REACT_APP_ENV === "LOCAL"
    ? process.env.REACT_APP_LOCAL
    : process.env.REACT_APP_STAGING;
const baseURL = `${baseDomain}`;

export default axios.create({
  baseURL,
});
