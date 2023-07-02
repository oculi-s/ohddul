import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import styles from '@/styles/Stock/Stock.module.scss';
import { Num, Fix, Price, Color, Quar, Per, Div } from '@/module/ba';
import { bpsHelp, epsHelp, prHelp, roeHelp } from '#/stockData/HelpDescription';
import dt from '@/module/dt';
import StockHead from '#/stockData/stockHead';
import ToggleTab from '#/base/ToggleTab';
import Help from '#/base/Help';
import '@/module/array';

import GroupFold from '#/stockFold/GroupFold';
import IndutyFold from '#/stockFold/IndutyFold';
import PriceElement from '#/stockData/stockPrice';
import EarnElement from '#/stockData/stockEarn';
import ShareElement from '#/stockData/stockShare';
import PredElement from '#/stockData/PredTable';

/**
 * earnonPrice를 통해 bps와 eps가 들어가있음
 *  
 * ROE는 제공하지 않음. 대부분 5% 이내로 의미 없음
*/
const MetaTable = ({ stockMeta, stockPredict, last, stockEarn = [] }) => {
    const lastPrice = last?.c;
    const amount = stockMeta?.a;
    const total = amount * lastPrice;
    const cnt = stockPredict?.data?.length || 0 + stockPredict?.queue?.length || 0;
    const EPS = (last?.eps || 0) / amount;
    const BPS = (last?.bps || 0) / amount;
    const ROE = Div(stockEarn?.slice(0, 4)?.map(e => e?.profit).sum(), stockEarn[0]?.equity);
    const revenueSum = Object.values(stockEarn)?.map(e => e?.revenue)?.sum();
    const profitSum = Object.values(stockEarn)?.map(e => e?.profit)?.sum();

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
                <tr><th>정답률</th><td>{Fix(cnt, 1)}%</td></tr>
            </tbody></table>
        </div >
    )
}


const Index = ({
    meta, group, price, index, induty,
    predict,
    userMeta, userFavs, userPred,
    stockPrice, stockEarn, stockShare,
    stockPredict,
}) => {
    const { data: session } = useSession();
    const uid = session?.user?.uid;
    const router = useRouter();
    let { code } = router.query;
    if (!meta?.data) return;
    if (!parseInt(code)) code = meta.index[code];
    if (!code) return;
    const stockMeta = meta?.data[code];
    if (!stockMeta) {
        return (
            <>
                <div>종목 정보가 없습니다.</div>
            </>
        )
    }
    const name = stockMeta?.n;
    stockPrice = stockPrice?.data?.sort(dt.lsort);
    stockEarn = stockEarn?.data?.sort(dt.lsort);
    stockShare = stockShare?.data;
    const last = stockPrice?.slice(-1)[0];
    const props = {
        code, name, last, router,
        meta, group, price, index, induty,
        predict,
        uid, userMeta, userFavs, userPred,
        stockMeta, stockEarn, stockPrice, stockShare,
        stockPredict,
    };

    const tabContents = {
        names: ['가격변화', '실적추이', '지분정보', '예측모음'],
        datas: [
            <div key={0}>
                <PriceElement {...props} />
            </div>,
            <div key={1}>
                <EarnElement {...props} />
                <p className='des'>* 기준일 : {dt.toString(stockEarn?.last)}</p>
            </div>,
            <div key={2}>
                <ShareElement {...props} />
            </div>,
            <div key={3}>
                <PredElement {...props} />
            </div>
        ]
    }
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
    )
}

import container, { getServerSideProps } from "@/container";
export { getServerSideProps };
export default container(Index);