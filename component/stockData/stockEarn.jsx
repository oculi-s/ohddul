import styles from '$/Stock/Stock.module.scss';
import EarnChart from '#/chart/EarnBar';
import dt from '@/module/dt';
import { useEffect, useState } from 'react';
import { Color, Div, Num, Quar } from '@/module/ba';
import Help from '#/base/Help';
import '@/module/array';
import { profitHelp, revenueHelp } from './HelpDescription';

function EarnTable({ stockMeta, earn }) {
    if (!earn.length) return;

    const amount = stockMeta?.a;
    const [N, setN] = useState(5);
    const [view, setView] = useState(true);
    useEffect(() => {
        setN(5);
        setView(true);
    }, [stockMeta])

    const len = earn.length;
    earn = earn.sort(dt.sort);
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
    earn.forEach(({ date, profit, equity }) => {
        const year = date.slice(0, 4);
        if (!avgYear[year]) avgYear[year] = { profit: 0, equity, cnt: 0 };
        avgYear[year].profit += profit;
        avgYear[year].cnt++;
    });
    const data = earn.map((e, i) => {
        const { date, equity, revenue, profit } = e;
        const { Y, Q } = Quar(date);
        if (!avgQuar[Q]) avgQuar[Q] = { Q, equity: 0, revenue: 0, profit: 0, cnt: 0 };
        avgQuar[Q].equity += equity;
        avgQuar[Q].revenue += revenue;
        avgQuar[Q].profit += profit;
        avgQuar[Q].cnt++;

        const PR = Div(profit, revenue);
        const ROE = avgYear[Y];
        var isRoe = Q == 4;
        if (ROE?.cnt < 4) isRoe = true;
        return <tr key={date} className={i >= N ? 'd' : ''}>
            <th>
                <span className='mh'>{Y.slice(0, 2)}</span>
                <span>{Y.slice(2)} </span>
                {Q}Q
            </th>
            <td>{Num(equity / amount)}</td>
            <td className={Color(revenue)}>{Num(revenue / amount)}</td>
            <td className={Color(profit)}>{Num(profit / amount)}</td>
            {isRoe && <td
                rowSpan={ROE?.cnt}
                className={Color(ROE?.profit / ROE?.equity)}>
                {Div(ROE?.profit, ROE?.equity)}
            </td>}
            <td>
                <span>{PR}</span>
                <div
                    className={styles.bar}
                    style={{ width: PR[0] == '-' ? '0' : PR }}
                />
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
                            <td>
                                <span>{PR}</span>
                                <div
                                    className={styles.bar}
                                    style={{ width: PR[0] == '-' ? '0%' : PR }}
                                >
                                </div>
                            </td>
                            <td>{Num(revenue / cnt / amount)}</td>
                            <td>{Num(profit / cnt / amount)}</td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </div>
        <h3>전체실적</h3>
        <table className={styles.earnTable}>
            <thead>{head}</thead>
            <tbody>
                {data}
                {view && <tr onClick={() => {
                    setN(N + 5);
                    if (N + 5 >= len) { setView(false); }
                }} className={styles.more}>
                    <th colSpan={6}>더보기</th>
                </tr>}
            </tbody>
        </table>
    </div>;
}

const EarnElement = (props) => {
    return <>
        <h3>실적 차트</h3>
        <EarnChart {...props} y={true} />
        <EarnTable {...props} />
    </>
}

export default EarnElement;