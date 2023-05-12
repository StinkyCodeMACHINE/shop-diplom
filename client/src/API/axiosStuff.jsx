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

$authHost.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("token")}`

// const authInterceptor = config => {
//     config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
//     return config
// }

// $authHost.interceptors.request.use(authInterceptor);

