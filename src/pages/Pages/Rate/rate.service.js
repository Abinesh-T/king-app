import { httpClient } from "lib/axios";

export const api_add_rate = async (payload) => {
    return await httpClient
        .post('rate/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_edit_rate = async (payload) => {
    return await httpClient
        .put('rate/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_all_rate = async () => {
    return await httpClient
        .get('rate/')
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};