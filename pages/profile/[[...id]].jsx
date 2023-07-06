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

import { PredBar } from "#/stockData/stockHead";
import FavStar from "#/base/FavStar";
import Container from "@/container/light";
import { Curtain, Profile } from "#/profile/Header";
import { CrawlUser } from "@/module/prop/props";
import { useEffect } from "react";

/**
 * asdf
 */
export async function getServerSideProps(ctx) {
    const aside = json.read(dir.stock.light.aside);
    const userMeta = json.read(dir.user.meta);

    const qid = ctx.query?.id;
    let props = { aside, userMeta };
    const session = await getSession(ctx);

    let uid = false, id = false, rank = false, queue = [], favs = [];
    if (qid) {
        uid = Object.keys(userMeta).find(k => userMeta[k].id == qid);
        id = userMeta[uid]?.id;
        rank = userMeta[uid]?.rank;
        queue = json.read(dir.user.pred(uid), { queue: [] }).queue;
        favs = json.read(dir.user.favs(uid), []);
    } else if (session?.user) {
        uid = session?.user?.uid;
        id = session?.user?.meta?.id;
        rank = session?.user?.meta?.rank;
        queue = json.read(dir.user.pred(uid), { queue: [] }).queue;
        favs = json.read(dir.user.favs(uid), []);
        const user = { favs, queue };
        props = { ...props, user };
    }
    const Meta = json.read(dir.stock.meta).data;
    const Price = json.read(dir.stock.all);

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) =>
                favs?.includes(k)
                || queue?.find(e => e.code == k)))
    }
    const meta = Filter(Meta);
    const price = Filter(Price);
    const title = `${id}님의 프로필 : 오떨`
    props = { ...props, id, uid, queue, favs, rank, meta, price, title };
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
                <LineChart {...props} />
            </div>
        </>
    )
}

const PredTable = ({ pred, meta, price }) => {
    const names = ['오떨예측', '가격예측']
    const queueTable = pred?.map((e, i) => {
        const { code, change, date } = e;
        const target = price[code]?.c + change;
        return <tr key={`pred${i}`}>
            <th><Link href={`/stock/${code}`}>{meta[code]?.n}</Link></th>
            <td>
                <span className={`fa fa-chevron-${change > 0 ? 'up red' : 'down blue'}`} />
            </td>
            <td>{Num(target)} ({Fix(change / price[code]?.c * 100)}%)</td>
            <td>{dt.toString(date, { time: 1 })}</td>
        </tr>
    });
    return <ToggleTab names={names} />
    return <table><tbody>{queueTable}</tbody></table>;
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

const Index = ({
    id, uid, rank, pred, favs,
    meta, price,
    User, setUser,
}) => {
    // console.log(User);
    const router = useRouter()
    const { data: session, status } = useSession();
    const user = session?.user;
    const qid = router.query?.id;

    useEffect(() => {
        if (!qid) {
            if (!uid) uid = user?.uid;
            if (!rank) rank = user?.rank;
            if (!pred) pred = user?.pred;
            if (!favs) favs = user?.favs;
            console.log(uid, id, rank, user);
        }
    }, [session])

    const mine = user?.uid == uid;
    if (!qid && status == 'unauthenticated') {
        return <>로그인을 진행해주세요</>
    } else if (!uid) {
        return <>{qid} : 존재하지 않는 사용자입니다.</>;
    }

    const props = {
        User, setUser,
        pred, favs,
        id, uid, rank, mine,
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
    }
    return (
        <>
            <Curtain {...props} />
            <Profile {...props} />
            <hr />
            <ToggleTab {...tabContents} />
        </>
    )
}

export default Container(Index);