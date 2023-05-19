import axios from 'axios'
import { API_URL } from '../utils/consts'

//для обычных запросов без авторизации
export const $host = axios.create({ 
    baseURL: API_URL
})

//для обычных запросов c авторизацией
export const $authHost = axios.create({
    baseURL: API_URL
});

$authHost.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});

