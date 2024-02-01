import { httpClient } from "lib/axios";

export const api_add_billing = async (payload) => {
    return await httpClient
        .post('sales_invoice/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_edit_billing = async (payload) => {
    return await httpClient
        .put('sales_invoice/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_all_billing = async (date) => {
    return await httpClient
        .get(`sales_invoice/?date=${date}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_billing_by_id = async (id) => {
    return await httpClient
        .get(`sales_invoice/?invoice_id=${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_billing_parties = async () => {
    return await httpClient
        .get(`sales_invoice/?create_invoice=true`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_delete_billing = async (id) => {
    return await httpClient
        .delete(`sales_invoice/?invoice_id=${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};