import { update, git } from '@/pages/api/xhr';
import { useState, useRef, useEffect } from 'react';
import json from '@/module/json';
import dt from '@/module/dt';
import styles from '@/styles/Admin/Admin.module.scss';
import { getSession } from 'next-auth/react';
import dir from '@/module/dir';
import { Div } from '@/module/ba';
import Link from 'next/link';
import { PredBar } from '../../pages/stock/Head';

export const getServerSideProps = async (ctx) => {
    const update = json.read('$/.update', { updating: 0, startTime: dt.num() });
    const userInfo = (await getSession(ctx))?.user;
    const admin = userInfo?.admin || false;
    const price = json.read(dir.stock.all);
    const meta = json.read(dir.stock.meta).data;
    const YEARS = dt.YEARS();
    const earnCount = {};
    const earnDatas = Object.fromEntries(Object.keys(meta)
        .map(code => [code, json.read(dir.stock.earn(code), { data: [] }).data]));
    const types = { 3: '-03-31', 2: '-06-30', 4: '-09-30', 1: '-12-31' };
    for await (let year of YEARS) {
        earnCount[year] = [0, 0, 0, 0];
        for await (let type of '1423') {
            const key = `${year}${types[type]}`;
            const i = dt.toJson(key).M / 3 - 1;
            earnCount[year][i] = Object.values(earnDatas)
                .filter(e => e.length)
                .filter(e =>
                    e.find(c => (c.date == key) && c.data)
                ).length;
        }
    }
    const earns = Object.entries(earnDatas).filter(([k, v]) => !v?.length).map(e => e[0]);
    const shares = Object.keys(meta)
        .filter(code => !json.read(dir.stock.share(code), { data: [] }).data.length)
    const yahooBlocked = Object.keys(meta)
        .filter(code => dt.update(json.read(dir.stock.price(code))));
    const props = {
        ...update, admin, price, meta,
        earns, shares,
        earnCount, yahooBlocked
    };
    return { props };
}

const Info = ({
    meta,
    yahooBlocked,
    earnCount, shares, earns
}) => {
    const count = Object.keys(meta).length
    const earnTotal = count - earns?.length;
    const shareTotal = count - shares?.length;
    const YEARS = dt.YEARS();
    const len = YEARS.length;
    const priceCount = count - yahooBlocked.length;
    return <div className={styles.info}>
        <div className={styles.box}>
            <h3>요약</h3>
            <table>
                <tbody>
                    <tr><th>PRICE</th><td>
                        <span>{priceCount}/{count} ({Div(priceCount, count)})</span>
                        <div className={styles.bar} style={{ width: Div(priceCount, count) }}></div>
                    </td></tr>
                    <tr><th>EARN</th><td>
                        <span>{earnTotal}/{count} ({Div(earnTotal, count)})</span>
                        <div className={styles.bar} style={{ width: Div(earnTotal, count) }}></div>
                    </td></tr>
                    <tr><th>SHARE</th><td>
                        <span>{shareTotal}/{count} ({Div(shareTotal, count)})</span>
                        <div className={styles.bar} style={{ width: Div(shareTotal, count) }}></div>
                    </td></tr>
                </tbody>
            </table>

            <div className={styles.inline}>
                <table><tbody>
                    {YEARS.slice(0, len / 2).map(year => {
                        const yearCount = earnCount[year];
                        return <>
                            <tr key={`${year}`}><th rowSpan={5}>{year}</th></tr>
                            {yearCount.map((c, i) => (
                                <tr key={`${year}_${i}`}>
                                    <th>{i + 1}Q</th>
                                    <td>
                                        <span>({Div(c, count)})</span>
                                        <div className={styles.bar} style={{ width: Div(c, count) }}></div>
                                    </td>
                                </tr>
                            ))}
                        </>
                    })}
                </tbody></table>
                <table><tbody>
                    {YEARS.slice(len / 2).map(year => {
                        const yearCount = earnCount[year];
                        return <>
                            <tr key={`${year}`}><th rowSpan={5}>{year}</th></tr>
                            {yearCount.map((c, i) => (
                                <tr key={`${year}_${i}`}>
                                    <th>{i + 1}Q</th>
                                    <td>
                                        <span>({Div(c, count)})</span>
                                        <div className={styles.bar} style={{ width: Div(c, count) }}></div>
                                    </td>
                                </tr>
                            ))}
                        </>
                    })}
                </tbody></table>
            </div>
        </div >
        <div className={styles.box}>
            <h3>가격이 최신이 아닌 종목 ({yahooBlocked.length}개)</h3>
            {yahooBlocked.map(code => {
                const name = meta[code]?.name;
                return <span key={code}>
                    <Link href={`/stock/${code}`}>{name}</Link>({meta[code]?.type}),
                </span>
            })}
        </div>
        <div className={styles.box}>
            <h3>실적이 없는 종목 ({count - earnTotal}개)</h3>
            {earns?.map(code => {
                const name = meta[code]?.name;
                return <span key={code}>
                    <Link href={`/stock/${code}`}>{name}</Link>({meta[code]?.type}),
                </span>
            })}
        </div>
        <div className={styles.box}>
            <h3>지분이 없는 종목 ({count - shareTotal}개)</h3>
            {shares?.map(code => {
                const name = meta[code]?.name;
                return <span key={code}>
                    <Link href={`/stock/${code}`}>{name}</Link>({meta[code]?.type}),
                </span>
            })}
        </div>
    </div >
}

const Update = ({ updating, startTime, endTime }) => {
    const now = dt.num();
    const ref = useRef();
    const [updateState, setUpdating] = useState(updating);
    const [time, setTime] = useState(now - startTime);
    clearInterval(ref?.current);
    ref.current = setInterval(() => { setTime(dt.num() - startTime) }, 1000);
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) return null;
    const go = async () => {
        setTime(0);
        setUpdating(1);
        startTime = dt.num();
        await update.all();
        endTime = dt.num();
        setUpdating(2);
    }
    const stop = async () => {
        await update.stop();
        clearInterval(ref?.current);
        setTime(0);
        setUpdating(0);
    }
    const data = (
        (updateState == 0) ?
            (<>
                <button onClick={go}>
                    업데이트 시작
                </button>
            </>) : (updateState == 1) ?
                (<div>
                    업데이트중입니다.<br />
                    시작시간 : {dt.toString(startTime, { time: 1 })}<br />
                    {dt.hhmmss(time)}<br />
                    <button onClick={stop}>업데이트 중단</button>
                </div>) : (<div>
                    업데이트 완료<br />
                    소요시간 : {dt.hhmmss(endTime - startTime)}<br />
                    <button onClick={go}>
                        다시 시작
                    </button>
                </div>)
    )
    return <div className={styles.box}>
        <h3>업데이트</h3>
        {data}
    </div>
}

const Nav = () => {
    const earnReset = () => {
        if (confirm('실적을 리셋하겠습니까?')) {
            update.earn();
        }
    }
    const priceReset = () => {
        if (confirm('가격을 리셋하겠습니까?')) {
            update.price();
        }
    }
    const shareReset = () => {
        if (confirm('지분을 리셋하겠습니까?')) {
            update.share();
        }
    }
    const predReset = () => {
        if (confirm('예측을 리셋하겠습니까?')) {
            update.pred();
        }
    }
    return <nav className={styles.nav}>
        <div>
            <h3>DELETE</h3>
            <button onClick={earnReset}>EARN</button>
            <button onClick={priceReset}>PRICE</button>
            <button onClick={shareReset}>SHARE</button>
            <button onClick={predReset}>PRED</button>
        </div>
        <div>
            <h3>GIT</h3>
            <button onClick={e => { git.push() }}>PUSH</button>
            <button onClick={e => { git.pull() }}>PULL</button>
        </div>
    </nav>
}

const Index = ({
    admin, updating, startTime, endTime, price, meta,
    earnCount, shares, earns, yahooBlocked
}) => {
    if (!admin) return <></>;
    const props = {
        admin, updating, startTime, endTime, price, meta,
        earnCount, shares, earns, yahooBlocked
    };
    const code = '005930';
    return <>
        <Nav {...props} />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@latest/css/font-awesome.min.css"></link>
        <main className={styles.main}>
            <div className={styles.box}>
                <h3>해야할 일</h3>
                <ol>
                    <li>2023.06.21 03:20 (45:38 걸림) 줄일방법 찾아야함..</li>
                    <li>업데이트 서버 분리</li>
                </ol>
                <div className={styles.predBar}>
                    <PredBar {...{
                        name: meta[code]?.name, code, testing: true, help: false,
                        last: price[code]
                    }} />
                </div>
            </div>
            <Update {...props} />
            <Info {...props} />
        </main>
    </>
}

export default Index;