import axios from "axios";
import { getToken } from "../api/storage";
import BASE_URL from "./baseurl";

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default instance;
