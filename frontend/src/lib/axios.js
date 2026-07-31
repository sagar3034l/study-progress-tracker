import axios from 'axios'

const API_URL = import.meta.env.API_URL || "http://localhost:3000/api"

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { "Content-type": "application/json"},
})






