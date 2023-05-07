import { $authHost, $host } from "./axiosStuff"
import jwtDecode from 'jwt-decode'

export const registration = async (email, password) => {
    const {data} = await $host.post('/api/user/registration', {email, password, role:'ADMIN'})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token) //можно ещё в куки
}

export const login = async (email, password) => {
  const {data} = await $host.post("/api/user/login", {
    email,
    password
  });
  localStorage.setItem('token', data.token) //можно ещё в куки
  return jwtDecode(data.token)
};

export const check = async () => {
  const { data } = await $authHost.get("/api/user/auth");
  localStorage.setItem("token", data.token); //можно ещё в куки
  return jwtDecode(data.token);
};

//подфиксить check (get без боди)