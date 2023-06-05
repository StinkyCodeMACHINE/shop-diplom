import { axiosAuthReq, axiosReq } from "./axiosStuff";
import jwtDecode from "jwt-decode";

export async function registration(name, email, password) {
  const { data } = await axiosReq.post("/api/user/registration", {
    name,
    email,
    password,
    role: "ADMIN",
  });
  return data;
}

export async function login(email, password) {
  const { data } = await axiosReq.post("/api/user/login", {
    email,
    password,
  });
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
}

export async function check() {
  const { data } = await axiosAuthReq.get("/api/user/auth");
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
}

export async function changeProfile(profile) {
  const { data } = await axiosAuthReq.put("/api/user/", profile);
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
}


export async function getUserInfo() {
  const { data } = await axiosAuthReq.get("/api/user/one");
  return data;
}