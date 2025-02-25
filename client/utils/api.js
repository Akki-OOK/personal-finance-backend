
import axios from "axios";

const API = axios.create({
    //backend api URL
  baseURL: "http://localhost:5000/api",
});

// Add JWT token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const login = (data) => API.post("/users/login", data);
export const register = (data) => API.post("/users/register", data);

// Transactions APIs
export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data) => API.post("/transactions", data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
