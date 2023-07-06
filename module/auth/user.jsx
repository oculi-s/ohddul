import json from "@/module/json";
import { user as dir } from "@/module/dir";

export function find(id) {
    const userInfo = json.read(dir.admin, {});
    return userInfo[id] || false;
}

/**
 * uid를 굳이 만들 필요가 없다. 그냥 id사용하면 됨.
 */
export function create(user) {
    const id = user?.id;
    const name = user?.name;
    const email = user?.email;
    const admin = json.read(dir.admin, {});
    admin[id] = { name, email, rank: 1000 };
    json.write(dir.admin, admin, false);
    console.log(`${id} user created`);
    return { id, email, email, rank: 1000, queue: [], favs: [] };
}