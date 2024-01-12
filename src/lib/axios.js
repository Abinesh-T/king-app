import axios from "axios";

import { API_URL } from "../config";

function authRequestInterceptor(config) {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.authorization = `token ${token}`;
    }
    config.headers.Accept = "application/json";
    return config;
}

export const httpClient = axios.create({
    baseURL: API_URL,
});

httpClient.interceptors.request.use(authRequestInterceptor);
