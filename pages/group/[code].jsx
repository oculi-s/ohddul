import styles from '$/Group/Group.module.scss'
import { useRouter } from "next/router";
import Link from "next/link";
import GroupFold from "#/stockFold/GroupFold";
import { ToggleQuery, ToggleTab } from '#/base/ToggleTab';
import Help from '#/base/Help';

import { priceHelp } from '#/group/HelpDescription';
import PriceElement from '#/group/groupPrice';

import { Num, Price } from "@/module/ba";
import dir from '@/module/dir';
import json from '@/module/json';
import '@/module/array';
import { useEffect, useState } from 'react';
import api from '../api';

/**
 * 그룹 정보를 보여주는 페이지
 * 
 * 데이터 줄이기 
 * meta : 350 --> 221 (-129kb)
 * meta.index 삭제 : 114 -> 44.1 (-69.9kb)
 * price : 221 --> 148 (-73kb)
 * induty : 277 --> 238 (-39kb)
 */
export async function getServerSideProps(ctx) {
    const tab = ctx.query?.tab || 'price';
    const code = ctx.query?.code;
    const group = json.read(dir.stock.light.group).data[code] || {};

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) => group?.ch?.includes(k)))
    }

    // const groupPrice = group.ch?.map(e=>{
    //     const price = json.read(dir.stock.price(e)).data;

    // })
    const predict = json.read(dir.stock.predAll);

    const Meta = json.read(dir.stock.meta).data;
    const Price = json.read(dir.stock.all);
    const index = json.read(dir.stock.light.index).data;
    const Induty = json.read(dir.stock.light.induty).data;

    const meta = Filter(Meta);
    const price = Filter(Price);
    const induty = Filter(Induty);
    const earn = group?.ch?.map(code => {
        const data = json.read(dir.stock.earn(code)).data.filter(e => e.data);
        const equity = data.map(e => e?.equity).sum();
        const revenue = data.map(e => e?.revenue).sum();
        const profit = data.map(e => e?.profit).sum();
        return { code, equity, revenue, profit };
    }) || []
    const share = group?.ch?.map(e =>
        [e, json.read(dir.stock.share(e)).data]
    ) || []

    const title = group?.n ? `${group?.n}그룹 : 오떨` : null;
    let props = {
        tab,
        title, code,
        group, index, induty,
        predict,
        meta, price, earn, share
    };
    return { props }
}

function MetaTable({
    group, meta, price, code, earn
}) {
    meta.light = true;
    if (!group) return;

    const groupEarn = {
        equity: earn?.map(e => e?.equity)?.sum(),
        revenue: earn?.map(e => e?.revenue)?.sum(),
        profit: earn?.map(e => e?.profit)?.sum()
    };
    const priceTotal = group?.p;
    const groupPrice = group?.ch
        ?.map(e => ({ code: e, c: meta[e]?.a * price[e]?.c }))
        ?.qsort((b, a) => a.c - b.c);
    const groupClose = groupPrice?.map(e => e?.c).sum() / group?.ch?.map(e => meta[e]?.a).sum();
    const first = groupPrice?.find(e => true);

    const amount = group?.ch?.map(e => meta[e]?.a)?.sum();
    const BPS = groupEarn.equity / amount;
    return <div className={styles.meta}>
        <table><tbody>
            <tr><th>시가총액</th><td>{Price(priceTotal)}</td></tr>
            <tr><th>수정주가<Help {...priceHelp} /></th><td>{Num(groupClose)}</td></tr>
            {/* <tr><th>BPS<Help {...bpsHelp} /></th><td>{Num(BPS)}</td></tr> */}
            <tr><th>종목 수</th><td>{group?.ch?.length}</td></tr>
            <tr>
                <th>대표주</th>
                <td>
                    <Link href={`/stock/${first?.code}`}>
                        {meta[first?.code]?.n}
                    </Link>
                </td>
            </tr>
        </tbody></table>
    </div>;
}

function Group({ group, tab, meta, price, code, earn, index, induty }) {
    const router = useRouter();
    const [load, setLoad] = useState({ price: true });
    const [groupPrice, setGroupPrice] = useState({});
    const [prices, setPrices] = useState({});

    const props = { group, tab, meta, price, earn, index, induty, router, code, load, groupPrice };
    const query = ['price', 'earn', 'share'];
    const names = ['주가정보', '실적정보', '출자정보'];

    useEffect(() => {
        const nums = [20, 60, 120];
        async function fetch() {
            console.time('groupPriceLoad');
            setLoad({ price: true });
            if (prices[code]) {
                setGroupPrice(prices[code]);
            } else {
                const groupPrice = {};
                setGroupPrice(groupPrice);
                await api.json.read({ url: dir.stock.groups.price(code) })
                    .then(price => {
                        groupPrice.priceRaw = price;
                    })
                for await (let num of nums) {
                    await api.json.read({ url: dir.stock.chart.group(code, num) })
                        .then(price => {
                            groupPrice[num] = price;
                        })
                }
                prices[code] = groupPrice;
                setPrices(prices);
                setGroupPrice(groupPrice);
            }
            setLoad({ price: false });
            console.timeEnd('groupPriceLoad');
        }
        fetch();
    }, [code]);

    if (!group?.n) return <>그룹 정보가 없습니다.</>;
    return <>
        <div>
            <h2 className={styles.title}>{code}그룹</h2>
            <hr />
            <GroupFold {...props} />
            <MetaTable {...props} />
        </div>
        <hr />
        <ToggleQuery query={query} names={names} />
        {tab == 'price' ? <div className={styles.groupPrice}>
            <PriceElement {...props} />
        </div> : ''}
    </>;
}

export default Group;