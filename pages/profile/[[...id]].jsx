import { useRouter } from "next/router";
import styles from '$/Profile/Index.module.scss'
import { getSession, useSession } from "next-auth/react";
import LineChart from '#/chart/line';
import Link from "next/link";
import { Num, Fix, Per, Color } from '@/module/ba'
import dt from "@/module/dt";
import ToggleTab from "#/base/ToggleTab";

import dir from "@/module/dir";
import json from "@/module/json";

import FavStar from "#/base/FavStar";
import { Curtain, Profile } from "#/profile/Header";
import { useEffect } from "react";
import PredBar from "#/common/PredBar";
import { PredTable } from "#/profile/profilePred";

/**
 * asdf
 */
export async function getServerSideProps(ctx) {
    const aside = json.read(dir.stock.light.aside);
    const userMeta = json.read(dir.user.admin);

    const qid = ctx.query?.id;
    const session = await getSession(ctx);
    let props = { aside, userMeta, session };

    let id = false, rank = false, email = false, queue = [], favs = [];
    if (qid) {
        id = Object.keys(userMeta).find(k => userMeta[k].id == qid);
        rank = userMeta[id]?.rank;
        email = userMeta[id]?.email;
        queue = json.read(dir.user.pred(id), { queue: [] }).queue;
        favs = json.read(dir.user.favs(id), []);
    } else if (session?.user) {
        id = session?.user?.id;
        email = session?.user?.email;
        rank = session?.user?.rank;
        queue = session?.user?.queue;
        favs = json.read(dir.user.favs(id), []);
        const user = { favs, queue };
        props = { ...props, user };
    }
    const Meta = json.read(dir.stock.meta).data;
    const Price = json.read(dir.stock.all);

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) =>
                favs?.includes(k)
                || queue?.find(e => e.c == k)))
    }
    const meta = Filter(Meta);
    const price = Filter(Price);
    const title = `${id}님의 프로필 : 오떨`
    props = {
        ...props,
        id, queue, favs, rank,
        meta, price, title
    };
    return { props };
}

const Graph = ({ id, rank }) => {
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
    )
}

const FavTable = ({ meta, price, pred, favs, mine, User, setUser }) => {
    const head = <tr>
        <th>종목</th>
        <th>가격</th>
        <th>전일비</th>
    </tr>
    const Rows = ({ code }) => {
        const name = meta[code]?.n;
        const close = price[code]?.c;
        const prev = price[code]?.p;
        return <>
            <tr>
                <th>
                    {mine && <FavStar {...{ code, User, setUser }} />}
                    <Link href={`/stock/${code}`}>{name}</Link>
                </th>
                <td>{close}</td>
                <td className={Color(close - prev)}>{Per(close, prev)}</td>
            </tr>
            {mine && <tr>
                <th colSpan={3}>
                    <PredBar {...{
                        code, last: price[code], name,
                        help: false, testing: true
                    }} />
                </th>
            </tr>}
        </>
    }
    const body = favs?.map(code =>
        <tbody key={code}>
            <Rows {...{ code }} />
        </tbody>)
    return <>
        <table>
            <thead>{head}</thead>
            {body}
        </table>
        {!mine && <p className="des">관심종목에 종목을 추가하면 <Link href={'/profile'}>내 프로필</Link>에서 예측바를 통해 바로 예측을 진행할 수 있습니다.</p>}
    </>
}

function Index({
    id, rank,
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
                <h3>대기중인 예측</h3>
                <PredTable {...props} />
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