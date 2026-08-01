import axios from 'axios'

const API_URL = import.meta.env.MODE === "developement" ? "http://localhost:3000/api" : "/api"

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { "Content-type": "application/json"},
})


// import.meta.env.API_URL || "http://localhost:3000/api"



