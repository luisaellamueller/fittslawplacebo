import axios from "axios";

const API_URL = "http://localhost:5001/api/probands";

export const saveProband = async (data) => {
  return axios.post(API_URL, data);
};
