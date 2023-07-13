import json from "@/module/json";
import dt from '@/module/dt';
import { user as dir } from "@/module/dir";
import { renderToStaticMarkup } from 'react-dom/server';
import Link from "next/link";

/**
 * Session에 담길 정보는 id, uid, favs뿐
 * 나머지는 fetch를 통해 알아올것
 */
export function findUid(uid) {
    const id = json.read(dir.ids).index[uid];
    const favs = json.read(dir.favs(uid), {});
    if (id) return { id, uid, favs };
    else return false;
}

export function findId(id) {
    const ids = json.read(dir.ids).index;
    const res = Object.keys(ids)
        ?.map(uid => json.read(dir.meta(uid)))
        ?.find(e => e.id == id);
    return res || false;
}

export function meta() {
    const ids = json.read(dir.ids).index;
    const res = Object.keys(ids)
        ?.map(uid => [ids[uid], json.read(dir.meta(uid))])
        ?.map(([id, meta]) => ([id, meta.rank]));
    return res || [];
}

export function change({ id, uid, email }) {
    if (id) {
        const meta = json.read(dir.meta(uid));
        meta.id = id;
        json.write(dir.meta(uid), meta);
        const ids = json.read(dir.ids);
        const oid = ids.index[uid];
        delete ids[oid];
        ids[id] = uid;
        ids.index[uid] = id;
        json.write(dir.ids, ids, 0);
    }
    if (email) {
        const meta = json.read(dir.meta(uid));
        meta.email = email;
        json.write(dir.meta(uid), meta, 0);
    }
}

const firstAlarm = [{
    title: "오르고, 떨어지고, 오떨에 오신것을 환영합니다.",
    data: renderToStaticMarkup(
        <>
            <p>회원가입을 축하드립니다.</p>
            <p>지금 바로 예측을 시작해보세요.</p>
            <Link href={'/stock/삼성전자'}>삼성전자 예측하러 가기</Link>
        </>
    ),
    d: dt.num(),
    ch: false,
}]

/**
 * uid는 초기에 들어오는 id로 사용하고, 나중에 유저가 id를 수정할 수 있도록 함.
 */
export function create(user) {
    const uid = user?.id;
    const name = user?.name;
    const email = user?.email;
    const meta = json.read(dir.ids);
    const data = { id: uid, name, email, rank: 1000 };
    meta[uid] = uid;
    meta.index[uid] = uid;
    json.write(dir.ids, meta, false);
    json.write(dir.meta(uid), data, false);
    json.write(dir.alarm(uid), firstAlarm, false);
    console.log(`${uid} user created`);
    return { id: uid, uid, favs: {} };
}