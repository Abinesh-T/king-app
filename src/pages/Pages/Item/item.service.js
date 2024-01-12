import { httpClient } from "lib/axios";

export const api_add_item = async (payload) => {
    return await httpClient
        .post('item/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_edit_item = async (payload) => {
    return await httpClient
        .put('item/', payload)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_all_item = async () => {
    return await httpClient
        .get('item/')
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};

export const api_delete_item = async (id) => {
    return await httpClient
        .delete(`item/?item_id=${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err;
        });
};