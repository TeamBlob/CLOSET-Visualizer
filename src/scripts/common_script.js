export const findKeyByName = (jsonData, name) => {
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].name.trim() === name.trim()) {
            return jsonData[i].key;
        }
    }
    return -1; // Return -1 if name is not found
};

export const findProfileByName = (jsonData, name, type) => {
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].name.trim() === name.trim()) {
            return {
                profile: jsonData[i],
                type: type
            }
        }
    }
    return -1; // Return -1 if name is not found
};

export const concatList = (list1, list2) => {
    return [...list1, ...list2];
}