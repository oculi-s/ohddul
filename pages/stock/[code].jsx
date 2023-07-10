import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '$/Stock/Stock.module.scss';
import { Num, Fix, Price, Color, Per, Div } from '@/module/ba';
import { bpsHelp, epsHelp, prHelp, roeHelp } from '#/stockData/HelpDescription';
import dt from '@/module/dt';
import StockHead from '#/stockData/stockHead';
import ToggleTab from '#/base/ToggleTab';
import { LastUpdate } from '#/base/base';
import Help from '#/base/Help';
import '@/module/array';

import GroupFold from '#/stockFold/GroupFold';
import IndutyFold from '#/stockFold/IndutyFold';
import PriceElement from '#/stockData/stockPrice';
import EarnElement from '#/stockData/stockEarn';
import ShareElement from '#/stockData/stockShare';
import PredElement from '#/stockData/stockPred';

import Container from '@/container/heavy';

/**
 * earnonPrice를 통해 bps와 eps가 들어가있음
 *  
*/
const MetaTable = ({ stockMeta, stockPredict, stockPrice, stockEarn = [] }) => {
    stockEarn = stockEarn?.data?.sort(dt.lsort);
    stockPrice = stockPrice?.data?.sort(dt.lsort);
    const last = stockPrice?.slice(-1)[0];

    const lastPrice = last?.c;
    const amount = stockMeta?.a;
    const total = amount * lastPrice;
    const EPS = (last?.eps || 0);
    const BPS = (last?.bps || 0);
    const ROE = Div(stockEarn?.slice(0, 4)?.map(e => e?.profit).sum(), stockEarn[0]?.equity);
    const revenueSum = Object.values(stockEarn)?.map(e => e?.revenue)?.sum();
    const profitSum = Object.values(stockEarn)?.map(e => e?.profit)?.sum();

    const cnt = stockPredict?.data?.length || 0 + stockPredict?.queue?.length || 0;

    return (
        <div className={`${styles.meta} clear`}>
            <table><tbody>
                <tr><th>시가총액</th><td>{Price(total)}</td></tr>
                <tr><th>최근종가</th><td>{Num(lastPrice)}</td></tr>
                {EPS && <tr>
                    <th>EPS<Help {...epsHelp} /></th>
                    <td>{Num(EPS)}&nbsp;
                        <span className={styles.percent}>
                            (<span className={Color(EPS - lastPrice)}>
                                {Per(EPS, lastPrice)}
                            </span>)
                        </span>
                    </td>
                </tr> || ''}
                {BPS && <tr>
                    <th>BPS<Help {...bpsHelp} /></th>
                    <td>{Num(BPS)}&nbsp;
                        <span className={styles.percent}>
                            (<span className={Color(BPS - lastPrice)}>
                                {Per(BPS, lastPrice)}
                            </span>)
                        </span>
                    </td>
                </tr> || ''}
                {ROE && <tr>
                    <th>ROE<Help {...roeHelp} /></th>
                    <td>{ROE}</td>
                </tr> || ''}
                {revenueSum && profitSum && <tr>
                    <th>이익률<Help {...prHelp} /></th>
                    <td>{Div(profitSum, revenueSum)}</td>
                </tr> || ''}
                <tr><th>총 예측 수</th><td>{cnt}</td></tr>
                <tr><th>정답률</th><td>{Fix(0, 1)}%</td></tr>
            </tbody></table>
        </div >
    )
}

/**
 * favs는 heavy container에서 사용하는 User와 setUser를 이용한다
 * 
 * pred는 꼬이면 안되기 때문에 중복제출 방지를 위해 session에 저장하고 update를 사용한다.
 */
function Index({
    User, setUser,
    meta, group, price, index, induty,
    predict, userMeta,
    stockPrice, stockEarn, stockShare, stockPredict,
}) {
    const router = useRouter();
    let code = router.query?.code;
    if (!parseInt(code)) code = meta.index[code];
    if (!meta?.data) return;
    if (!code) return;
    const stockMeta = meta?.data[code];
    if (!stockMeta) {
        return <div>종목 정보가 없습니다.</div>;
    }
    const last = price[code] || stockPrice?.data[0];
    const props = {
        User, setUser,
        code, router,
        meta, group, price, index, induty, last,
        predict,
        userMeta,
        stockMeta, stockEarn, stockPrice, stockShare,
        stockPredict,
    };

    const tabContents = {
        names: ['가격변화', '실적추이', '지분정보', '예측모음'],
        datas: [
            <div key={0}>
                <PriceElement {...props} />
                <LastUpdate data={stockPrice} />
            </div>,
            <div key={1}>
                <EarnElement {...props} />
                <LastUpdate data={stockEarn} />
            </div>,
            <div key={2}>
                <ShareElement {...props} />
                <LastUpdate data={stockShare} />
            </div>,
            <div key={3}>
                <PredElement {...props} />
            </div>
        ]
    };
    return (
        <>
            <StockHead {...props} />
            <hr />
            <GroupFold {...props} />
            <IndutyFold {...props} />
            <MetaTable {...props} />
            <hr />
            <ToggleTab {...tabContents} />
        </>
    );
}

import { getServerSideProps } from "@/container/stock";
export { getServerSideProps };
export default Container(Index);