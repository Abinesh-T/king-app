import { httpClient } from "lib/axios";

export const api_add_billing = async (payload) => {
    return await httpClient
        .post('invoice/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_edit_billing = async (payload) => {
    return await httpClient
        .put('invoice/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_all_billing = async (date) => {
    return await httpClient
        .get(`invoice/?date=${date}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_billing_by_id = async (id) => {
    return await httpClient
        .get(`invoice/?invoice_id=${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_delete_billing = async (id) => {
    return await httpClient
        .delete(`invoice/?invoice_id=${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};