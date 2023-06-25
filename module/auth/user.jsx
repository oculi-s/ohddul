import json from "@/module/json";

const dirInfo = '@/module/auth/user.json'
const dirMeta = `$/user/meta.json`
const dirPred = uid => `$/user/${uid}/predict.json`
const defInfo = { index: {} }
export const find = (key) => {
    let userInfo = json.read(dirInfo, defInfo);
    if (userInfo.index == undefined) userInfo.index = {};
    if (userInfo[key] || userInfo?.index[key])
        return userInfo[userInfo[key]] || userInfo[userInfo.index[key]];
    return false;
}

export const create = (user) => {
    let { id, uid } = user;
    const userInfo = json.read(dirInfo, defInfo);
    const userMeta = json.read(dirMeta, {});
    userInfo[uid] = user;
    userInfo.index[id] = uid;
    userMeta[uid] = { rank: 1000, id: id };
    json.write(dirMeta, userMeta, false);
    json.write(dirInfo, userInfo, false);
    return json.write(dirPred(uid), { queue: [], data: [] });
}