import { useRouter } from "next/router";
import styles from '$/Profile/Index.module.scss'
import { getSession, useSession } from "next-auth/react";
import LineChart from '#/chart/line';
import ToggleTab from "#/base/ToggleTab";

import dir from "@/module/dir";
import json from "@/module/json";

import { Curtain, Profile } from "#/profile/Header";
import { FavTable } from "#/profile/profileFavs";
import ProfilePred from "#/profile/profilePred";
import { useEffect } from "react";

/**
 * asdf
 */
export async function getServerSideProps(ctx) {
    const admin = json.read(dir.user.admin);

    const qid = ctx.query?.id?.find(e => true);
    const session = await getSession(ctx);
    let props = {};

    let uid = false, queue = [], favs = [];
    let id, rank, email;
    if (qid) {
        uid = admin[qid];
        id = qid;
        const meta = json.read(dir.user.meta(uid), { rank, email });
        queue = json.read(dir.user.pred(uid), { queue: [] }).queue;
        favs = json.read(dir.user.favs(uid), []);
        props = { ...props, id, ...meta, queue, favs };
    } else if (session?.user) {
        const meta = session?.user;
        queue = session?.user?.queue;
        favs = session?.user?.favs;
        props = { ...props, ...meta, queue, favs };
    }
    const Meta = json.read(dir.stock.meta).data;
    const Price = json.read(dir.stock.all);

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) =>
                Object.keys(favs)?.includes(k)
                || queue?.find(e => e.c == k)))
    }
    const meta = Filter(Meta);
    const price = Filter(Price);
    const title = id ? `${id}님의 프로필 : 오떨` : false;
    props = { ...props, meta, price, title };
    return { props };
}

function Graph({ id, rank }) {
    const prev = Math.floor(rank / 100) * 100;
    const forNext = (rank - prev);
    const { data: session } = useSession();
    const user = session?.user;

    const props = { horLine: rank, data: user?.pred?.data, name: id };
    return (
        <>
            <div className={styles.bar}>
                <div rank={rank} style={{ width: Math.max(forNext, 1) + '%' }}></div>
            </div>
            <p className="des">다음랭크까지(+{100 - forNext})</p>
            <div className={styles.chart}>
                {/* <LineChart {...props} /> */}
            </div>
        </>
    );
}

function Index({
    id, rank, email,
    queue, favs, meta,
    price, User, setUser,
}) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user;
    const qid = router.query?.id;

    useEffect(() => {
        if (!qid) {
            if (!id) id = user?.id;
            if (!rank) rank = user?.rank;
            if (!favs) favs = user?.favs;
            if (!queue) queue = user?.queue;
        }
    }, [session]);

    const mine = user?.id == id;
    if (!qid && status == 'unauthenticated') {
        return <>로그인을 진행해주세요</>;
    } else if (!id) {
        return <>{qid} : 존재하지 않는 사용자입니다.</>;
    }

    const props = {
        User, setUser, user,
        queue, favs,
        id, rank, mine,
        meta, price,
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
            <Curtain {...props} />
            <Profile {...props} />
            <hr />
            <ToggleTab {...tabContents} />
        </>
    );
}

export default Index;