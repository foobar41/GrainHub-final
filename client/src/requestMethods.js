import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOTI0ZjM4NjRhODM2YTJiZTFiYWZlMyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0MTcxODMyOCwiZXhwIjoxNjQxOTc3NTI4fQ.BHKvrS09UpdDaToxnbbJzQeat-vcSXC2LJcxD0aYo1k"
const TOKEN = localStorage.getItem("accessToken")
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  header: { token: `Bearer ${TOKEN}` },
});
