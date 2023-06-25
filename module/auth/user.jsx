import json from "@/module/json";
import { user as dir } from "@/module/dir";

const defInfo = { index: {} }
export const find = (key) => {
    let userInfo = json.read(dir.admin, defInfo);
    if (userInfo.index == undefined) userInfo.index = {};
    if (userInfo[key] || userInfo?.index[key])
        return userInfo[userInfo[key]] || userInfo[userInfo.index[key]];
    return false;
}

export const create = (user) => {
    let { id, uid } = user;
    const userInfo = json.read(dir.admin, defInfo);
    const userMeta = json.read(dir.meta, {});
    userInfo[uid] = user;
    userInfo.index[id] = uid;
    userMeta[uid] = { rank: 1000, id: id };
    json.write(dir.meta, userMeta, false);
    json.write(dir.admin, userInfo, false);
    return json.write(dir.pred(uid), { queue: [], data: [] });
}