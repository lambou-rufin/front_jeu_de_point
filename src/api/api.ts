import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3002', // URL de base depuis la variable d'environnement
  responseType: "json",
  withCredentials: true,
  headers: {
    "content-type": "application/json",
    "accept": "application/json",
  },
});

export default api;

// Alternative si vous avez besoin de form data
export const baseWithFormData = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3002',
  responseType: "json",
  withCredentials: true,
  headers: {
    "content-type": "multipart/form-data",
  },
});
