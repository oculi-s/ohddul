import { useRouter } from "next/router";
import styles from '$/Profile/Index.module.scss'
import { getSession, useSession } from "next-auth/react";
import LineChart from '#/chart/line';
import ToggleTab from "#/base/ToggleTab";

import dir from "@/module/dir";
import json from "@/module/json";

import Header from "#/profile/Header";
import { FavTable } from "#/profile/profileFavs";
import ProfilePred from "#/profile/profilePred";
import { useEffect, useState } from "react";
import api from "@/pages/api";
import { Int, Sleep } from "@/module/ba";
import { getRank } from "#/User";

/**
 * asdf
 */
export async function getServerSideProps(ctx) {
    const ids = json.read(dir.user.ids);

    const qid = ctx.query?.id?.find(e => true);
    const session = await getSession(ctx);
    let props = {};

    let pred = { queue: [], data: [] }, favs = [];
    let id, uid = false;
    if (qid) {
        uid = ids[qid];
        id = qid;
        favs = json.read(dir.user.favs(uid), []);
    } else if (session?.user) {
        const user = session?.user;
        uid = user?.uid;
        id = user?.id;
        favs = session?.user?.favs;
    }
    props = { ...props, uid, id, favs };
    pred = json.read(dir.user.pred(uid), { data: [], queue: [] });
    const Meta = json.read(dir.stock.meta).data;
    const Price = json.read(dir.stock.all);

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) =>
                Object.keys(favs)?.includes(k)
                || pred?.queue?.find(e => e.c == k)
                || pred?.data?.find(e => e.c == k)))
    }
    const meta = Filter(Meta);
    const price = Filter(Price);
    const title = id ? `${id}님의 프로필 : 오떨` : false;
    props = { ...props, meta, price, title };
    return { props };
}

function Graph({ userMeta: meta }) {
    const rank = meta?.rank;
    const [color] = getRank(rank);
    const prev = Math.floor(rank / 100) * 100;
    const forNext = Int(rank - prev);

    const props = { horLine: rank };
    return (
        <>
            <div className={styles.bar}>
                <div className={`bg-${color}`} style={{ width: Math.max(forNext, 1) + '%' }}></div>
            </div>
            <p className="des">다음랭크까지(+{100 - forNext})</p>
            <div className={styles.chart}>
                {/* <LineChart {...props} /> */}
            </div>
        </>
    );
}

function Index({
    uid, id, favs, // user
    email,
    meta, price, ban, // stock
}) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user;
    const qid = router.query?.id;

    useEffect(() => {
        if (!qid) {
            if (!id) id = user?.id;
            if (!uid) uid = user?.uid;
            if (!favs) favs = user?.favs;
        }
    }, [session]);

    /**
     * userPred와 userMeta를 api를 통해 읽어와야 함.
     */
    const [userPred, setPred] = useState({ queue: [], data: [] });
    const [userMeta, setMeta] = useState({ rank: 1000 });
    const [loadUser, setLoad] = useState({ meta: true, pred: true });
    useEffect(() => {
        async function fetch() {
            if (uid) {
                api.json.read({ url: dir.user.meta(uid) }).then(meta => {
                    setMeta(meta);
                    setLoad(e => { e.meta = false; return e });
                })
                api.json.read({ url: dir.user.pred(uid) }).then(pred => {
                    setPred(pred);
                    setLoad(e => { e.pred = false; return e });
                })
            }
        }
        fetch();
    }, [uid])

    const mine = user?.id == id;
    if (!qid && status == 'unauthenticated') {
        return <>로그인을 진행해주세요</>;
    } else if (!id) {
        return <>{qid} : 존재하지 않는 사용자입니다.</>;
    }

    const props = {
        status,
        userMeta, userPred, setPred, loadUser, // Client Fetch
        user, uid, favs, id, mine, // Server
        meta, price, ban, // stock
    };
    const tabContents = {
        names: ["랭크변화", mine ? "내 예측" : "예측", "관심종목"],
        datas: [
            <div key={0} className={styles.box}>
                <h3>랭크 변화</h3>
                <Graph {...props} />
            </div>,
            <div key={1}>
                <ProfilePred {...props} />
            </div>,
            <div key={2}>
                <h3>관심 종목</h3>
                <FavTable {...props} />
            </div>
        ]
    };
    return (
        <>
            <Header {...props} />
            <hr />
            <ToggleTab {...tabContents} />
        </>
    );
}

export default Index;