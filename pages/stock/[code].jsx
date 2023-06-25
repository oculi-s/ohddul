import styles from '@/styles/Stock/Stock.module.scss';
import { useRouter } from 'next/router';
import { Num, Fix, Price, Color, Quar, Per, Div } from '@/module/ba';
import dt from '@/module/dt';
import { useSession } from 'next-auth/react';
import Help from '@/component/base/help';
import StockHead from './Head';
import ToggleTab from '@/component/base/tab';
import '@/module/array';

import GroupFold from './Group';
import IndutyFold from './Induty';
import PriceElement from './Price';
import EarnElement from './Earn';
import ShareElement from './Share';
import PredElement from './Pred';

/**
 * earnonPrice를 통해 bps와 eps가 들어가있음
 *  
 * ROE는 제공하지 않음. 대부분 5% 이내로 의미 없음
*/
const MetaTable = ({ stockMeta: { amount }, stockPredict, last, stockEarn }) => {
    const lastPrice = last?.close;
    const lastDate = last?.date;
    const total = amount * lastPrice;
    const cnt = stockPredict?.data?.length || 0 + stockPredict?.queue?.length || 0;
    const EPS = (last?.eps || 0) / amount;
    const BPS = (last?.bps || 0) / amount;
    const revenueSum = Object.values(stockEarn).map(e => e.revenue).sum();
    const profitSum = Object.values(stockEarn).map(e => e.profit).sum();
    const epsPercent = EPS / lastPrice - 1;
    const bpsPercent = BPS / lastPrice - 1;

    return (
        <div className={`${styles.meta} clear`}>
            <table>
                <tbody>
                    <tr><th colSpan={2}><p className='des'>기준일자 : {lastDate}</p></th></tr>
                    {/* <tr><th>종목코드</th><td>{code}</td></tr> */}
                    <tr><th>시가총액</th><td>{Price(total)}</td></tr>
                    <tr><th>최근종가</th><td>{Num(lastPrice)}</td></tr>
                    <tr className={EPS ? '' : 'd'}>
                        <th>EPS<Help span="(초기자본 + 누적이익) / (발행 주식)" /></th>
                        <td>
                            {Num(EPS)}&nbsp;
                            <span className={styles.percent}>
                                (<span className={Color(epsPercent)}>
                                    {Fix(epsPercent * 100, 1)}%
                                </span>)
                            </span>
                        </td>
                    </tr>
                    <tr className={BPS ? '' : 'd'}>
                        <th>BPS<Help span="(분기별 자본금) / 발행주식" /></th>
                        <td>
                            {Num(BPS)}&nbsp;
                            <span className={styles.percent}>
                                (<span className={Color(bpsPercent)}>
                                    {Fix(bpsPercent * 100, 1)}%
                                </span>)
                            </span>
                        </td>
                    </tr>
                    <tr className={revenueSum && profitSum ? '' : 'd'}>
                        <th>이익률<Help span="이익총합 / 매출총합" /></th>
                        <td>{Div(profitSum, revenueSum)}</td>
                    </tr>
                    <tr><th>총 예측 수</th><td>{cnt}</td></tr>
                    <tr><th>정답률</th><td>{Fix(cnt, 1)}%</td></tr>
                </tbody>
            </table>
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
    const { code } = router.query;
    if (!meta?.data) return <></>;
    const stockMeta = meta?.data[code];
    if (!stockMeta) {
        return (
            <>
                <div>종목 정보가 없습니다.</div>
            </>
        )
    }
    const name = stockMeta?.name;
    stockPrice = stockPrice?.data?.sort(dt.lsort);
    stockEarn = stockEarn?.data;
    stockShare = stockShare?.data;
    stockEarn = stockEarn?.sort(dt.lsort);
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

import container, { getServerSideProps } from "@/pages/container";
export { getServerSideProps };
export default container(Index);