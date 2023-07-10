import json from "@/module/json";
import { user as dir } from "@/module/dir";
import { renderToStaticMarkup } from 'react-dom/server';

export function findUid(uid) {
    const id = json.read(dir.admin).index[uid];
    if (!id) return false;
    const user = json.read(dir.meta(uid), false);
    const queue = json.read(dir.pred(uid), { queue: [] }).queue;
    const favs = json.read(dir.favs(uid), []);
    const alarm = json.read(dir.alarm(uid), []);
    if (user) return { ...user, id, uid, queue, favs, alarm };
    else return false;
}

export async function findId(id) {
    const list = json.read(dir.admin);
    const res = list
        ?.map(uid => json.read(dir.meta(uid)))
        ?.find(e => e.id == id);
    return res || false;
}

export async function change({ id, uid, email }) {
    if (id) {
        const meta = json.read(dir.admin);
        const oid = meta.index[uid];
        delete meta[oid];
        meta[id] = uid;
        meta.index[uid] = id;
        json.write(dir.admin, meta, 0);
    }
    if (email) {
        const meta = json.read(dir.meta(uid));
        meta.email = email;
        json.write(dir.meta(uid), meta, 0);
    }
}

const firstAlarm = [{
    title: "오떨에 오신것을 환영합니다.",
    data: renderToStaticMarkup(
        <>
            <p>회원가입을 축하드립니다.</p>
            <p>지금 바로 예측을 시작해보세요.</p>
        </>
    )
}]

/**
 * uid는 초기에 들어오는 id로 사용하고, 나중에 유저가 id를 수정할 수 있도록 함.
 */
export function create(user) {
    const uid = user?.id;
    const name = user?.name;
    const email = user?.email;
    const meta = json.read(dir.admin);
    const data = { name, email, rank: 1000 };
    meta[uid] = uid;
    meta.index[uid] = uid;
    json.write(dir.admin, meta, false);
    json.write(dir.meta(uid), data, false);
    json.write(dir.alarm(uid), firstAlarm, false);
    console.log(`${uid} user created`);
    return {
        ...data, id: uid, uid, queue: [], favs: [], alarm: firstAlarm
    };
}