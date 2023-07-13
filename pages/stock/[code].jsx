import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '$/Stock/Stock.module.scss';
import { Num, Fix, Price, Color, Per, Div, Sleep } from '@/module/ba';
import { bpsHelp, epsHelp, prHelp, roeHelp } from '#/stockData/HelpDescription';
import StockHead from '#/stockData/stockHead';
import ToggleTab from '#/base/ToggleTab';
import { LastUpdate, Loading } from '#/base/base';
import Help from '#/base/Help';
import { useSession } from 'next-auth/react';
import api from '../api';
import dir from '@/module/dir';
import dt from '@/module/dt';
import '@/module/array';

import GroupFold from '#/stockFold/GroupFold';
import IndutyFold from '#/stockFold/IndutyFold';
import PriceElement from '#/stockData/stockPrice';
import EarnElement from '#/stockData/stockEarn';
import ShareElement from '#/stockData/stockShare';
import PredElement from '#/stockData/stockPred';

// import Container from '@/container/heavy';

/**
 * earnonPrice를 통해 bps와 eps가 들어가있음
 *  
*/
const MetaTable = ({ stockMeta: meta, stockPred: pred, last, earn = [] }) => {
    earn?.qsort(dt.lsort);

    const lastPrice = last?.c;
    const amount = meta?.a;
    const total = amount * lastPrice;
    const EPS = (last?.eps || 0);
    const BPS = (last?.bps || 0);
    const ROE = Div(earn?.slice(0, 4)?.map(e => e?.profit).sum(), earn[0]?.equity);
    const revenueSum = Object.values(earn)?.map(e => e?.revenue)?.sum();
    const profitSum = Object.values(earn)?.map(e => e?.profit)?.sum();

    const dataLen = pred?.data?.length || 0;
    const queueLen = pred?.queue?.length || 0;
    const right = pred?.data?.filter(e => e.v >= 0).length || 0;

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
                <tr><th>총 예측 수</th><td>{dataLen + queueLen}</td></tr>
                <tr><th>정답률</th><td>{Div(right, dataLen, 1)} ({right}/{dataLen})</td></tr>
            </tbody></table>
        </div >
    )
}

function Index(props) {
    const { meta, ban, code, stockMeta, stockPrice, earn, share } = props;
    const router = useRouter();

    const [userPred, setPred] = useState({ queue: [], data: [] });
    const [loadUser, setLoad] = useState({ pred: true });
    const uid = props?.session?.user?.uid;
    useEffect(() => {
        console.log('predBar 렌더링중');
        async function fetch() {
            if (uid) {
                api.json.read({ url: dir.user.pred(uid) }).then(pred => {
                    setPred(pred);
                    setLoad(e => { e.pred = false; return e });
                })
            }
        }
        fetch();
    }, [code])


    if (!meta?.data) return;
    if (!stockMeta) {
        return <div>종목 정보가 없습니다.</div>;
    }
    stockPrice?.data?.qsort(dt.lsort);
    const last = stockPrice?.data?.slice(-1)[0];
    props = {
        ...props,
        last, router, share: share.data, earn: earn.data, ban: ban[code],
        userPred, loadUser, setPred,
    };

    const tabContents = {
        names: ['가격변화', '실적추이', '지분정보', '예측모음'],
        datas: [
            <div key={0}>
                <PriceElement {...props} />
                <LastUpdate last={stockPrice.last} />
            </div>,
            <div key={1}>
                <EarnElement {...props} />
                <LastUpdate last={earn.last} />
            </div>,
            <div key={2}>
                <ShareElement {...props} />
                <LastUpdate last={share.last} />
            </div>,
            <div key={3}>
                <PredElement {...props} />
            </div>
        ]
    };
    if (ban[code]) tabContents.names.pop()
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
export default Index;