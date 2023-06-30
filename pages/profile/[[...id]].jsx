import { useRouter } from "next/router";
import { getRank, getBg } from "@/pages/_user";
import styles from '@/styles/Profile.module.scss'
import { useSession } from "next-auth/react";
import LineChart from '#/chart/line';
import Link from "next/link";
import { Num, Fix, Per, Color } from '@/module/ba'
import dt from "@/module/dt";
import ToggleTab from "#/base/ToggleTab";

const Curtain = ({ rank }) => (
    <div
        className={styles.curtain}
        style={{ background: `linear-gradient(180deg, var(--rank-${rank.slice(0, -1)}), transparent)` }}
    />
)

const Header = ({ rank, num, bg, id }) => (
    <h1 className={styles.id}>
        <span
            className={rank.slice(0, -1)}
            ranknum={num}
            style={{ backgroundImage: `url(${bg.src})` }}>
        </span>
        {id}
    </h1>
)

const Profile = (props) => {
    const { rank, score, userPred } = props;
    let queue = userPred?.queue;
    let data = userPred?.data;
    let ts = score;
    data = data
        ?.sort(dt.sort)
        ?.map(e => {
            e.value = ts;
            ts -= e.change;
            return e;
        });
    return (
        <div className={styles.profile}>
            <Curtain {...props} />
            <Header {...props} />
            <div className={rank.slice(0, -1)}>
                <b>{rank[0].toUpperCase() + rank.slice(-1)} {score}</b>
            </div>
            <span>
                <p>{data?.length || 0}개 예측완료 {queue?.length || 0}개 대기중</p>
                <p>오/떨 적중 (N/N) 회 (30 %)</p>
                가입일, 최종 접속시간
            </span>
        </div >
    )
}

const Graph = ({ id, rank, forNext, userPred }) => {
    const props = { horLine: rank, data: userPred?.data, name: id };
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

const PredTable = ({ userPred, meta, price }) => {
    const queueTable = userPred?.queue?.map((e, i) => {
        const { code, change, date } = e;
        const name = meta[code]?.n;
        const lastPrice = price[code]?.c;
        const target = lastPrice + change;
        return (
            <tr key={`pred${i}`}>
                <th>
                    <Link href={`/stock/${code}`}>
                        {name}
                    </Link>
                </th>
                <td>
                    <span className={`fa fa-chevron-${change > 0 ? 'up red' : 'down blue'}`} />
                </td>
                <td>{Num(target)} ({Fix(change / lastPrice * 100)}%)</td>
                <td>{dt.toString(date, { time: 1 })}</td>
            </tr>
        );
    });
    return <table><tbody>{queueTable}</tbody></table>;
}

const FavTable = ({ userFavs, userPred, meta, price, uid, mine }) => {
    const head = <tr>
        <th>종목</th>
        <th>가격</th>
        <th>전일비</th>
    </tr>
    const Rows = ({ code }) => {
        const name = meta[code]?.n;
        const close = price[code]?.c;
        const prev = price[code]?.p;
        const [favs, setFavs] = useState(true);
        return <>
            <tr>
                <th>
                    {mine && <FavStar {...{ code, uid, setFavs, favs }} />}
                    <Link href={`/stock/${code}`}>{name}</Link>
                </th>
                <td>{close}</td>
                <td className={Color(close - prev)}>{Per(close, prev)}</td>
            </tr>
            <tr>
                <th colSpan={3}>
                    <PredBar {...{
                        code, last: price[code], name,
                        help: false, testing: true
                    }} />
                </th>
            </tr>
        </>
    }
    const body = userFavs?.map(code => {
        return <tbody key={code}>
            <Rows {...{ code }} />
        </tbody>
    })
    return <table>
        <thead>{head}</thead>
        {body}
    </table>
}

const Index = ({
    meta, price,
    userMeta, userPred, userFavs,
}) => {
    const { data: session, status } = useSession();
    const router = useRouter()
    var mine = false;
    var { id } = router.query;
    if (!id && status == 'unauthenticated') {
        return (
            <>로그인을 진행해주세요</>
        )
    }
    if (!id) {
        var { id, uid } = session?.user;
        mine = true;
    } else {
        id = id[0];
        var uid = Object.keys(userMeta).find(k => userMeta[k].id == id);
    }
    if (!uid) {
        return (
            <>{id} : 존재하지 않는 사용자입니다.</>
        );
    }
    meta = meta.data;
    const score = userMeta[uid].rank;
    const [rank, nextRank] = getRank(score);
    const prevScore = Math.floor(score / 100) * 100;
    const forNext = (score - prevScore);
    const num = rank.slice(-1);
    const bg = getBg(rank);

    const props = {
        score, id, rank, nextRank, prevScore, forNext, num, bg, mine,
        userPred
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
                <PredTable {...{ userPred, meta, price }} />
            </div>,
            <div key={2}>
                <h3>관심 종목</h3>
                <FavTable {...{ userFavs, meta, price, uid, userPred, mine }} />
            </div>
        ]
    }
    return (
        <>
            <Profile {...props} />
            <hr />
            <ToggleTab {...tabContents} />
        </>
    )
}

import container, { getServerSideProps } from "@/pages/container";
import { FavStar, PredBar } from "../../component/stockData/stockHead";
import { useState } from "react";
export { getServerSideProps };
export default container(Index);