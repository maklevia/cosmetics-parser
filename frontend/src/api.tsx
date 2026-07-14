import axios from "axios";
import type { AxiosInstance } from "axios";

 export const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
    withCredentials: true
 }) 

