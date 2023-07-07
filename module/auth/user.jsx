import json from "@/module/json";
import { user as dir } from "@/module/dir";
import { renderToStaticMarkup } from 'react-dom/server';

export function findUid(uid) {
    const user = json.read(dir.meta(uid), false);
    const queue = json.read(dir.pred(uid), { queue: [] }).queue;
    const alarm = json.read(dir.alarm(uid), []);
    if (user) return { ...user, uid, queue, alarm };
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
    const meta = json.read(dir.meta(uid));
    if (id) meta.id = id;
    if (email) meta.email = email;
    json.write(dir.meta(uid), meta);
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
    const list = json.read(dir.admin);
    const data = { id: uid, name, email, rank: 1000 };
    list.push(uid);
    json.write(dir.admin, list, false);
    json.write(dir.meta(uid), data, false);
    json.write(dir.alarm(uid), firstAlarm, false);
    console.log(`${uid} user created`);
    return {
        ...data, uid, queue: [], alarm: firstAlarm
    };
}