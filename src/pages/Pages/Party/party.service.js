import { httpClient } from "lib/axios";

export const api_add_party = async (payload) => {
    return await httpClient
        .post('party/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_edit_party = async (payload) => {
    return await httpClient
        .put('party/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_all_party = async () => {
    return await httpClient
        .get('party/')
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_delete_party = async (id) => {
    return await httpClient
        .delete(`party/?party_id=${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};