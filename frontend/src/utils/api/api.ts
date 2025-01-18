import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "http://127.0.0.1:5000",
  timeout: 10000
})

export default api;