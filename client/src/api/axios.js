require('dotenv').config();
import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.API_URL,
});

// const token = localStorage.getItem('swiftship_token');
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('swiftship_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // console.log(token)
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('swiftship_token');
      localStorage.removeItem('swiftship_user');
    }
    return Promise.reject(err);
  }
);
// export const token1=token;
export default api;
