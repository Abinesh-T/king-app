import { httpClient } from "lib/axios";

export const api_login = async (payload) => {
    return await httpClient
        .post('login/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};