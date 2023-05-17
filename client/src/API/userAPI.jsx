import { $authHost, $host } from "./axiosStuff"
import jwtDecode from 'jwt-decode'

export async function registration(name, email, password) {
    const {data} = await $host.post('/api/user/registration', {name, email, password, role:"ADMIN"})
    return data
}

export async function login(email, password) {
  const {data} = await $host.post("/api/user/login", {
    email,
    password
  });
  localStorage.setItem("token", data.token) 
  return jwtDecode(data.token)
};

export async function check() {
  const { data } = await $authHost.get("/api/user/auth");
  localStorage.setItem("token", data.token); 
  return jwtDecode(data.token);
};
