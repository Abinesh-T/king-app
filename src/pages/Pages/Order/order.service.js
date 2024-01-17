import { httpClient } from "lib/axios";

export const api_add_order = async (payload) => {
    return await httpClient
        .post('order/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_edit_order = async (payload) => {
    return await httpClient
        .put('order/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_all_order = async (date) => {
    return await httpClient
        .get(`order/?date=${date}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_order_by_id = async (id) => {
    return await httpClient
        .get(`order/?order_id=${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_delete_order = async (id) => {
    return await httpClient
        .delete(`order/?order_id=${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};