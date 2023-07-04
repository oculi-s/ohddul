import { useRouter } from "next/router";
import { getRank, getBg } from "#/User";
import styles from '$/Profile.module.scss'
import { useSession } from "next-auth/react";
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
import { Curtain } from "#/profile/base";

/**
 * asdf
 */
export const getServerSideProps = (ctx) => {
    const aside = json.read(dir.stock.light.aside);
    const userMeta = json.read(dir.user.meta);
    const id = ctx.query?.id;
    let props = { aside, userMeta };
    // console.log(ctx.query?.id);

    if (id) {
        const uid = Object.keys(userMeta).find(k => userMeta[k].id == id);
        const pred = json.read(dir.user.pred(uid), { queue: [], data: [] });
        const favs = json.read(dir.user.favs(uid), []);
        props = { ...props, pred, favs };
    } else {

    }
    return { props };
}


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
    const { rank, score, user } = props;
    const queue = user?.pred?.queue;
    let data = user?.pred?.data;
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

const Graph = ({ id, rank, forNext }) => {
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

const PredTable = ({ pred }) => {
    console.log(pred);
    const queueTable = pred?.map((e, i) => {
        const { code, change, date, n, c } = e;
        const target = c + change;
        return (
            <tr key={`pred${i}`}>
                <th>
                    <Link href={`/stock/${code}`}>{n}</Link>
                </th>
                <td>
                    <span className={`fa fa-chevron-${change > 0 ? 'up red' : 'down blue'}`} />
                </td>
                <td>{Num(target)} ({Fix(change / c * 100)}%)</td>
                <td>{dt.toString(date, { time: 1 })}</td>
            </tr>
        );
    });
    return <table><tbody>{queueTable}</tbody></table>;
}

const FavTable = ({ meta, price, mine, User, setUser }) => {
    const { data: session } = useSession();
    const user = session?.user;

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
    const body = user?.favs?.map(code =>
        <tbody key={code}>
            <Rows {...{ code }} />
        </tbody>)
    return <table>
        <thead>{head}</thead>
        {body}
    </table>
}

const Index = ({
    aside, userMeta, pred,
    User, setUser,
}) => {
    // console.log(User);
    const { data: session, status } = useSession();
    const user = session?.user;

    const router = useRouter()
    var mine = false;
    var id = router.query?.id;
    if (!id && status == 'unauthenticated') {
        return (
            <>로그인을 진행해주세요</>
        )
    }
    var uid;
    if (!id) {
        id = user?.id;
        uid = user?.uid;
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
    const score = userMeta[uid]?.rank;
    const [rank, nextRank] = getRank(score);
    const prevScore = Math.floor(score / 100) * 100;
    const forNext = (score - prevScore);
    const num = rank.slice(-1);
    const bg = getBg(rank);

    const props = {
        User, setUser,
        pred,
        score, id, rank, nextRank, prevScore, forNext, num, bg, mine,
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
                {/* <FavTable {...props} /> */}
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

export default Container(Index);