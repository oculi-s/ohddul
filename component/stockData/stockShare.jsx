import styles from '$/Stock/Stock.module.scss';
import ShareDonut from "#/chart/ShareDonut";
import { Div, Price } from "@/module/ba";
import Help from '#/base/Help';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { overflowHelp } from './HelpDescription';
import { Loading } from '#/base/base';
import { MoreTable } from '#/base/Pagination';

function ShareTable({ meta, share, stockMeta }) {
    if (!share) return;
    const [data, setData] = useState();
    const [foot, setFoot] = useState();
    const [load, setLoad] = useState(true);
    useEffect(() => {
        if (share?.length) {
            let res = 0;
            const tot = share.map(e => e.amount).sum();
            const total = stockMeta?.a;
            var rt = false//tot > total;
            const data = share
                ?.filter(e => e?.amount / stockMeta?.a > 0.001)
                ?.map((e, i) => {
                    let { no, name, amount, date, rate } = e;
                    res += rt ? rate || 0 : amount;
                    const code = meta?.index[name];
                    if (code) {
                        name = <Link href={`/stock/${code}`}>{name}</Link>;
                    }
                    return <tr key={i}>
                        <th>{name}</th><td>{rt ? Div(rate, 100, 1) : Div(amount, total, 1)}</td>
                        <td className={styles.date}>
                            <Link
                                href={`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${no}`}
                                target='_blank'
                            >{date}</Link>
                        </td>
                    </tr>;
                });
            setFoot(<tr>
                <th>전체</th>
                <th>{rt ? Div(res, 100) : Div(res, stockMeta?.a)}</th>
                <th>-</th>
            </tr>)
            setData(data);
            setLoad(false);
        } else {
            setData([]);
            setLoad(false);
        }
    }, [share]);
    const head = <tr>
        <th>이름</th><th>지분</th>
        <th>기준일<Help span={`작년 사업보고서의 데이터를 기준으로 하며, 제공된 데이터에 따라 현재 상황과 차이가 날 수 있습니다.`} /></th>
    </tr>;
    return <div className={styles.shareTable}>
        {load ? <Loading left='auto' right='auto' />
            : data?.length ?
                <MoreTable head={head} data={data} foot={foot} start={8} />
                : <><p>API에서 제공된<br />지분 데이터가 없습니다.</p></>}
    </div>;
}

function OtherTable({ meta, share, price }) {
    if (!share) return;
    const [data, setData] = useState();
    useEffect(() => {
        if (share?.length) {
            share?.sort((b, a) =>
                price[a.from]?.c * a.amount - price[b.from]?.c * b.amount)
            const data = share
                ?.map((e, i) => {
                    const { no, amount, date, from } = e;
                    const total = meta?.data[from]?.a;
                    const name = <Link href={`/stock/${from}`}>{meta?.data[from]?.n}</Link>;
                    return <tr key={i}>
                        <th>{name}</th><td>{Div(amount, total, 1)}</td>
                        <td>{Price(amount * price[from]?.c)}</td>
                        <td className={styles.date}>
                            <Link
                                href={`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${no}`}
                                target='_blank'
                            >{date}</Link>
                        </td>
                    </tr>
                });
            setData(data);
        } else {
            setData([]);
        }
    }, [share])
    return <div className={styles.otherTable}>
        {data?.length ?
            <table>
                <thead>
                    <tr>
                        <th>이름</th><th>시총대비</th><th>총액</th>
                        <th>기준일<Help span={`작년 사업보고서의 데이터를 기준으로 하며, 제공된 데이터에 따라 현재 상황과 차이가 날 수 있습니다.`} /></th>
                    </tr>
                </thead>
                <tbody>{data}</tbody>
                <tfoot>
                    <tr>
                        <th>전체</th>
                        <th>-</th>
                        <th>{Price(share?.map(e => price[e.from]?.c * e.amount).sum())}</th><th>-</th>
                    </tr>
                </tfoot>
            </table> :
            <><p>이 회사가 소유한<br />다른 회사의 지분이 없습니다.</p></>
        }
    </div>
}

function ShareElement({ meta, price, stockMeta, share, other }) {
    console.log(share, other);
    share = share?.sort((b, a) => a.amount - b.amount);
    return <div>
        <h3>지분 차트<Help {...overflowHelp} />
        </h3>
        <div className={styles.share}>
            <ShareDonut share={share} meta={stockMeta} />
            <ShareTable share={share} meta={meta} stockMeta={stockMeta} />
        </div>
        <h3>이 회사가 보유한 다른 회사의 주식</h3>
        <div className={styles.share}>
            <OtherTable share={other} meta={meta} price={price} />
        </div>
    </div>;
}

export default ShareElement;