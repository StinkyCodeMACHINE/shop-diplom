import axios from "axios";
import { API_URL } from "../utils/consts";

//для обычных запросов без авторизации
export const axiosReq = axios.create({
  baseURL: API_URL,
});

//для обычных запросов c авторизацией
export const axiosAuthReq = axios.create({
  baseURL: API_URL,
});

axiosAuthReq.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});
