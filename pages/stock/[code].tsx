import styles from '$/Stock/Stock.module.scss';
import { LastUpdate } from '@/components/base/base';
import Help from '@/components/base/Help';
import { ToggleQuery } from '@/components/base/ToggleTab';
import { bpsHelp, epsHelp, prHelp, roeHelp } from '@/components/stockData/HelpDescription';
import StockHead from '@/components/stockData/stockHead';
import '@/module/array';
import { Color, Div, Num, Per, Price } from '@/module/ba';
import dt from '@/module/dt';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import EarnElement from '@/components/stockData/stockEarn';
import PredElement from '@/components/stockData/stockPred';
import PriceElement from '@/components/stockData/stockPrice';
import ShareElement from '@/components/stockData/stockShare';
import GroupFold from '@/components/stockFold/GroupFold';
import IndutyFold from '@/components/stockFold/IndutyFold';

import ChildFold from '@/components/stockFold/ChildFold';
import { FetcherRead } from '@/module/fetcher';
import { CloseType, EarnFixedType, MetaType, ShareFixedType, ShareOtherType, StockPriceType } from '@/utils/type';

/**
 * user가 존재하는 경우이거나 user의 페이지인 경우 유저 데이터를 불러와야함.
 * 
 * 그런데 유저데이터는 동적으로 수정이 가능해야하니까 object에 담아 보내면서
 * useState를 통해 실시간 수정되는 내용이 반영되도록 해야함
 * pred도 마찬가지이고 수정필요. 2023.07.04
 * 
 * 로그인된 유저가 존재할 때 구현방식 : api/auth에 담아 보낸다.
 * useSession을 통해 사용 가능
 * {@link './pages/api/auth/[...nextauth].jsx'}
 */
/**
 * Filter를 통해 사이즈 줄이기
 * * 줄이기 전 405kb
 * * group : 405 --> 389 (-16kb)
 * * meta : 389 --> 262 (-127kb)
 * * induty : 262 --> 222 (-40kb)
 * * price : 222 --> 150 (-72kb)
 * * meta.index : 149 --> 87 (-62kb)
 */
export async function getServerSideProps(ctx) {
    let name = ctx.query?.code;
    const tab = ctx.query?.tab || 'price';
    return {
        props: {
            name, tab
        }
    };
}

/**
 * earnonPrice를 통해 bps와 eps가 들어가있음
 *  
*/
function MetaTable({
    stockMeta: meta, pred, last, earn,
}: {
    stockMeta: any,
}) {
    earn = earn?.data || [];
    earn?.qsort(dt.lsort);

    const amount = meta?.a;
    const total = amount * last?.c;
    const EPS = (last?.eps || 0);
    const BPS = (last?.bps || 0);
    const ROE = Div(earn?.slice(-4)?.map(e => e?.profit).sum(), earn?.slice(-1)?.find(e => true)?.equity);
    const revenueSum = Object.values(earn)?.map(e => e?.revenue)?.sum();
    const profitSum = Object.values(earn)?.map(e => e?.profit)?.sum();

    const dataLen = pred?.data?.length || 0;
    const queueLen = pred?.queue?.length || 0;
    const right = pred?.data?.filter(e => e.v >= 0).length || 0;

    return (
        <div className='bg-trade-700 p-3 flex justify-end'>
            <table className='!w-auto ml-auto mr-0'><tbody>
                <tr><th>시가총액</th><td>{Price(total)}</td></tr>
                <tr>
                    <th>최근종가</th>
                    <td>
                        <div>{Num(last?.c)}</div>
                        <span className={styles.percent}>
                            (<span className={Color(last?.c - last?.p)}>
                                {Per(last?.c, last?.p)}
                            </span>)
                        </span>
                    </td>
                </tr>
                {EPS ? <tr>
                    <th>EPS<Help {...epsHelp} /></th>
                    <td>
                        <div>{Num(EPS)}</div>
                        <span className={styles.percent}>
                            (<span className={Color(EPS - last?.c)}>
                                {Per(EPS, last?.c)}
                            </span>)
                        </span>
                    </td>
                </tr> : ''}
                {BPS ? <tr>
                    <th>BPS<Help {...bpsHelp} /></th>
                    <td>
                        <div>{Num(BPS)}</div>
                        <span className={styles.percent}>
                            (<span className={Color(BPS - last?.c)}>
                                {Per(BPS, last?.c)}
                            </span>)
                        </span>
                    </td>
                </tr> : ''}
                {ROE ? <tr>
                    <th>ROE<Help {...roeHelp} /></th>
                    <td>{ROE}</td>
                </tr> : ''}
                {revenueSum && profitSum ? <tr>
                    <th>이익률<Help {...prHelp} /></th>
                    <td>{Div(profitSum, revenueSum)}</td>
                </tr> : ''}
                <tr><th>총 예측 수</th><td>{dataLen + queueLen}</td></tr>
                <tr><th>정답률</th><td>{Div(right, dataLen, 1)} ({right}/{dataLen})</td></tr>
            </tbody></table>
        </div>
    );
}

function StockQuery({
    meta, price, stockPrice, loadStock, setLoadStock, stockMeta,
    earn, share, other, pred, ids, ban,
}) {
    const query = ['price', 'earn', 'share', 'pred'];
    const names = ['가격변화', '실적추이', '지분정보', '예측모음'];
    if (ban) {
        query.pop();
        names.pop();
    }
    const router = useRouter();
    const tab = router?.query?.tab || 'price';
    return <div className='bg-trade-700 p-3 flex-1'>
        <ToggleQuery query={query} names={names} />
        {tab == 'price' ? <div>
            <PriceElement stockPrice={stockPrice} load={loadStock} setLoad={setLoadStock} />
            <LastUpdate last={stockPrice?.last} />
        </div> : tab == 'earn' ? <div>
            <EarnElement earn={earn?.data} meta={stockMeta} load={loadStock} setLoad={setLoadStock} />
            <LastUpdate last={earn?.last} />
        </div> : tab == 'share' ? <div>
            <ShareElement meta={meta} share={share?.data} other={other?.data} price={price} stockMeta={stockMeta} load={loadStock} setLoad={setLoadStock} />
            <LastUpdate last={share?.last} />
        </div> : <div>
            <PredElement meta={meta} ids={ids} pred={pred} />
        </div>}
    </div>
}

const prices = {}, earns = {}, shares = {}, others = {};
function Index({ ban, name, tab, session }: {
    name: string,
    tab: string,
    ban: { [key: string]: boolean }
    session: any
}) {
    const [meta, setMeta] = useState<MetaType>();
    const [group, setGroup] = useState<GroupType>();
    const [induty, setInduty] = useState<IndutyType>();
    const [index, setIndex] = useState<IndexType>();
    const [price, setPrice] = useState<CloseType>();

    const [earn, setEarn] = useState<EarnFixedType>();
    const [share, setShare] = useState<ShareFixedType>();
    const [other, setOther] = useState<ShareOtherType>();
    const [stockPrice, setStockPrice] = useState<StockPriceType>();
    const [code, setCode] = useState<string>('');

    const router = useRouter();
    const [userPred, setPred] = useState();
    const [loadUser, setLoadUser] = useState({ pred: true });
    const [loadStock, setLoadStock] = useState({ price: false, earn: false, share: false, pred: false });
    const uid = session?.user?.uid;

    useEffect(() => {
        console.log(name)
        console.time('meta');
        console.time('earnLoad');
        console.time('shareLoad');
        console.time('otherLoad');
        console.time('priceLoad');
        FetcherRead('/meta/light/group.json').then(e => {
            setGroup(e);
        }).catch(e => { console.log(e) });
        FetcherRead('/meta/light/induty.json').then(e => {
            setInduty(e);
        }).catch(e => { console.log(e) });
        FetcherRead('/meta/light/index.json').then(e => {
            setIndex(e);
        }).catch(e => { console.log(e) });

        FetcherRead('/meta/meta.json').then(e => {
            const code = e.index[name] || name;
            console.log(name, code);
            setCode(code);
            setMeta(e.data);
            console.timeEnd('meta');
            FetcherRead(`/stock/${code}/earnFixed.json`).then(e => {
                setEarn(e);
                console.timeEnd('earnLoad');
            }).catch(e => { console.timeEnd('earnLoad') });
            FetcherRead(`/stock/${code}/shareFixed.json`).then(e => {
                setShare(e);
                console.timeEnd('shareLoad');
            }).catch(e => { console.timeEnd('shareLoad') });
            FetcherRead(`/stock/${code}/other.json`).then(e => {
                setOther(e);
                console.timeEnd('otherLoad');
            }).catch(e => { console.timeEnd('otherLoad') });
            FetcherRead(`/stock/${code}/price.json`).then(e => {
                e.data.qsort(dt.lsort)
                setStockPrice(e);
                console.timeEnd('priceLoad');
            }).catch(e => { console.timeEnd('priceLoad') });
            FetcherRead('/meta/price.json').then(e => {
                setPrice(e);
            }).catch(e => { console.log(e) });
        }).catch(e => { console.timeEnd('meta') });
        return () => {
            setMeta({ data: {}, index: {} });
            setEarn({ data: [], last: 0 });
            setShare({ data: [], last: 0 });
            setOther({ data: [], last: 0 });
            setStockPrice({ data: [], last: 0 });
            setPrice({});
            setCode('');
        }
    }, [name]);

    console.log(code);
    if (!code) {
        return <div>종목 정보가 없습니다.</div>;
    }

    const stockMeta = meta?.[code];
    const stockGroup = group?.data[group?.index?.[code]]
    const stockInduty = induty?.data[induty?.index?.[code]]

    if (!stockMeta) {
        return <div>종목 정보가 없습니다.</div>;
    }
    const last = price?.[code];
    const props = {
        meta, price, stockMeta, stockPrice, earn, share, other,
        uid,
        last, router, ban: ban[code],
        userPred, loadUser, setPred,
        loadStock, setLoadStock,
    };

    return (
        <div>
            <StockHead
                stockMeta={stockMeta}
                ban={ban[code]}
                code={code}
                last={last}
                uid={uid}
                userPred={userPred}
                setPred={setPred}
                load={loadStock.price}
            />
            <div className='grid lg:grid-cols-6'>
                <div className='max-lg:hidden p-0.5'>
                    <MetaTable stockMeta={stockMeta} earn={earn} last={last} pred={[]} />
                </div>
                <div className='p-0.5 gap-0.5 h-full flex-col flex col-span-5'>
                    {group
                        ? <GroupFold meta={meta} price={price} group={stockGroup} induty={stockInduty} index={index} />
                        : <ChildFold {...props} />}
                    <IndutyFold {...props} />
                    <StockQuery {...props} />
                </div>
            </div>
        </div>
    );
}

export default Index;