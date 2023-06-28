import styles from '@/styles/Stock/Stock.module.scss';
import toggleOnPageChange from '@/component/base/toggle';
import EarnChart from '@/component/chart/Earn';
import dt from '@/module/dt';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Color, Div, Num, Quar } from '@/module/ba';
import Help from '@/component/base/help';

const EarnTable = ({ stockMeta, stockEarn }) => {
    const amount = stockMeta?.a;
    const [N, setN] = useState(5);
    const [view, setView] = useState(true);
    const router = useRouter();
    toggleOnPageChange(router, setN, 5);
    toggleOnPageChange(router, setView, true);
    if (!stockEarn) return;
    const len = stockEarn.length;
    stockEarn = stockEarn.sort(dt.sort);
    const head = <tr>
        <th>분기</th>
        <th>자본</th>
        <th>매출</th>
        <th>이익</th>
        <th>ROE<Help span="순이익/자본" /></th>
        <th>이익률</th>
    </tr>
    const avg = Array(5).map(() => false);
    const data = stockEarn.map((e, i) => {
        const { date, equity, revenue, profit } = e;
        const { Y, Q } = Quar(date);
        if (!avg[Q]) avg[Q] = { Q, equity: 0, revenue: 0, profit: 0, cnt: 0 };
        avg[Q].equity += equity;
        avg[Q].revenue += revenue;
        avg[Q].profit += profit;
        avg[Q].cnt++;
        return <tr key={date} className={i >= N ? 'd' : ''}>
            <th>
                <span className='mh'>{Y.slice(0, 2)}</span>
                <span>{Y.slice(2)} </span>
                {Q}Q
            </th>
            <td>{Num(equity / amount)}</td>
            <td className={Color(revenue)}>{Num(revenue / amount)}</td>
            <td className={Color(profit)}>{Num(profit / amount)}</td>
            <td className={Color(profit / equity)}>{Div(profit, equity)}</td>
            <td>
                <span>{Div(profit, revenue)}</span>
                <div className={styles.bar} style={{ width: Div(profit, revenue) }}></div>
            </td>
        </tr>
    });
    return <div>
        <h3>분기별 평균실적<Help span='평균적으로 이익률이 일정하고, 매출과 이익이 일정한 회사가 안정적인 회사입니다.' /></h3>
        <div>
            <table className={styles.earnTable}>
                <thead>
                    <tr>
                        <th>분기</th>
                        <th>이익률<Help span="순이익/매출" /></th>
                        <th>매출<Help span="매출총합/주식 수" /></th>
                        <th>이익<Help span="이익총합/주식 수" /></th>
                    </tr>
                </thead>
                <tbody>
                    {avg.map(e => {
                        if (!e) return;
                        const { Q, profit, revenue, cnt } = e;
                        return <tr key={Q}>
                            <th>{Q}Q</th>
                            <td>
                                <span>{Div(profit, revenue)}</span>
                                <div className={styles.bar} style={{ width: Div(profit, revenue) }}></div>
                            </td>
                            <td>{Num(revenue / cnt / amount)}</td>
                            <td>{Num(profit / cnt / amount)}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
        <h3>전체실적</h3>
        <table className={styles.earnTable}>
            <thead>{head}</thead>
            <tbody>
                {data}
                <tr onClick={() => {
                    if (N + 5 < len) {
                        setN(N + 5)
                    } else {
                        setView(false);
                    }
                }} className={`${view ? '' : 'd'} ${styles.more}`}>
                    <th colSpan={6}>더보기</th>
                </tr>
            </tbody>
        </table>
    </div>
}

const EarnElement = (props) => {
    return <>
        <h3>실적 차트</h3>
        <EarnChart {...props} y={true} />
        <EarnTable {...props} />
    </>
}

export default EarnElement;