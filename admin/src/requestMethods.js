import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";
const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken;

// console.log("user:",user)
// console.log("token:",TOKEN)
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOTI0ZjM4NjRhODM2YTJiZTFiYWZlMyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0MTcxODMyOCwiZXhwIjoxNjQxOTc3NTI4fQ.BHKvrS09UpdDaToxnbbJzQeat-vcSXC2LJcxD0aYo1k";

// console.log(localStorage.getItem("persist:root"));

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${TOKEN}` },
});

// export const userRequest = axios.create({
//   baseURL: BASE_URL,
// });

// Add an interceptor to add the token to the request header
userRequest.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);