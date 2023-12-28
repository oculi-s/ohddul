import styles from '$/Stock/Stock.module.scss';
import EarnChart from '#/chart/EarnBar';
import dt from '@/module/dt';
import { Color, Div, Num, Quar } from '@/module/ba';
import Help from '#/base/Help';
import '@/module/array';
import { earnnullHelp, profitHelp, revenueHelp } from './HelpDescription';
import { Bar } from '#/base/base';
import Link from 'next/link';
import { MoreTable } from '#/base/Pagination';

function EarnTable({ meta, earn, load }) {
    if (!earn?.length) return;

    const amount = meta?.a;
    earn = earn?.qsort(dt.sort);
    const head = <tr>
        <th>분기</th>
        <th>자본</th>
        <th>매출</th>
        <th>이익</th>
        <th>ROE</th>
        <th>이익률</th>
    </tr>;
    const avgQuar = Array(5).map(() => false);
    const avgYear = {};
    earn.forEach(({ date, profit, revenue, equity }) => {
        const year = date.slice(0, 4);
        if (!avgYear[year]) avgYear[year] = { profit: 0, equity, cnt: 0 };
        avgYear[year].profit += profit;
        avgYear[year].cnt++;
        const { Y, Q } = Quar(date);
        if (!avgQuar[Q]) avgQuar[Q] = { Q, equity: 0, revenue: 0, profit: 0, cnt: 0 };
        avgQuar[Q].equity += equity;
        avgQuar[Q].revenue += revenue;
        avgQuar[Q].profit += profit;
        avgQuar[Q].cnt++;
    });
    const data = earn.map((e, i) => {
        const { no, date, equity, revenue, profit } = e;
        const { Y, Q } = Quar(date);
        const PR = Div(profit, revenue);
        const ROE = avgYear[Y];
        var isRoe = Q == 4;
        console.log(Y, Q, isRoe);
        if (ROE?.cnt < 4 && ROE?.cnt == Q) isRoe = true;
        return <tr key={i}>
            <th>
                <Link href={`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${no}`}>
                    <span className='mh'>{Y.slice(0, 2)}</span>
                    <span>{Y.slice(2)} </span>
                    {Q}Q
                </Link>
            </th>
            <td>{Num(equity / amount)}</td>
            <td className={Color(revenue)}>{Num(revenue / amount)}</td>
            <td className={Color(profit)}>{Num(profit / amount)}</td>
            {isRoe && <td
                rowSpan={ROE?.cnt}
                className={Color(ROE?.profit / ROE?.equity)}>
                {Div(ROE?.profit, ROE?.equity)}
            </td>}
            <td style={{ position: 'relative' }}>
                <span>{PR}</span>
                <Bar width={PR[0] == '-' ? 0 : PR} />
            </td>
        </tr>;
    });
    return <div>
        <h3>분기별 평균실적
            <Help
                title={`분기별 평균 실적`}
                span={`업황 (업종의 상황)에 따라 회사의 이익이 달라지는 경우가 있습니다.  회사 영업의 안정성을 나타내는 지표입니다.`}
            />
        </h3>
        <div>
            <table className={styles.earnTable}>
                <thead>
                    <tr>
                        <th>분기</th>
                        <th>이익률</th>
                        <th>매출<Help {...revenueHelp} /></th>
                        <th>이익<Help {...profitHelp} /></th>
                    </tr>
                </thead>
                <tbody>
                    {avgQuar.map(e => {
                        if (!e) return;
                        const { Q, profit, revenue, cnt } = e;
                        const PR = Div(profit, revenue);
                        return <tr key={Q}>
                            <th>{Q}Q</th>
                            <td style={{ position: 'relative' }}>
                                <span>{PR}</span>
                                <Bar width={PR[0] == '-' ? '0' : PR} />
                            </td>
                            <td>{Num(revenue / cnt / amount)}</td>
                            <td>{Num(profit / cnt / amount)}</td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </div>
        <h3>전체실적<Help {...earnnullHelp} /></h3>
        <div className={styles.earnTable}>
            <MoreTable head={head} data={data} />
        </div>
    </div>;
}

function EarnElement({ earn, meta, load, setLoad }) {
    return <>
        <h3>실적 차트</h3>
        <EarnChart earn={earn} meta={meta} y={true} load={load} setLoad={setLoad} />
        <EarnTable earn={earn} meta={meta} load={load} setLoad={setLoad} />
    </>;
}

export default EarnElement;