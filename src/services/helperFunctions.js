export const getAlteredSelectionItem = array => {
    let modifiedList = array.map(e => {
        return {
            label: e.code,
            value: e.id,
            id: e.id,
        };
    });
    return modifiedList;
};

export const getAlteredSelectionParty = array => {
    let modifiedList = array.map(e => {
        return {
            label: e.name,
            value: e.id,
            id: e.id,
            type: e.party_type
        };
    });
    return modifiedList;
};

export const getUserDetails = () => {
    return JSON.parse(localStorage.getItem("user"));
}