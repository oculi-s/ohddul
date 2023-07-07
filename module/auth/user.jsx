import json from "@/module/json";
import { user as dir } from "@/module/dir";

export function find(uid) {
    const userInfo = json.read(dir.admin, {});
    const queue = json.read(dir.pred(uid), { queue: [] }).queue;
    if (userInfo[uid]) return { ...userInfo[uid], uid, queue };
    else return false;
}

/**
 * uid는 초기에 들어오는 id로 사용하고, 나중에 유저가 id를 수정할 수 있도록 함.
 */
export function create(user) {
    const uid = user?.id;
    const name = user?.name;
    const email = user?.email;
    const admin = json.read(dir.admin, {});
    admin[uid] = { id: uid, name, email, rank: 1000 };
    json.write(dir.admin, admin, false);
    console.log(`${uid} user created`);
    return { id: uid, email, email, rank: 1000, queue: [] };
}