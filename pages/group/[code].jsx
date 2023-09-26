import styles from '$/Group/Group.module.scss'
import { useRouter } from "next/router";
import Link from "next/link";
import GroupFold from "#/stockFold/GroupFold";
import { ToggleQuery, ToggleTab } from '#/base/ToggleTab';
import Help from '#/base/Help';

import { priceHelp } from '#/group/HelpDescription';
import GroupPriceElement from '#/group/groupPrice';

import { Num, Price } from "@/module/ba";
import dir from '@/module/dir';
import json from '@/module/json';
import '@/module/array';
import { useEffect, useState } from 'react';
import api from '../api';
import GroupShareElement from '#/group/groupShare';

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
    const Group = json.read(dir.stock.light.group).data;

    const List = Object.values(Group)
        ?.filter(e => e.p)
        ?.sort((b, a) => a.p - b.p);
    const i = List.findIndex(e => e.n == code);
    const prev = List[i - 1]?.n || false, next = List[i + 1]?.n || false;
    const group = Group[code] || {};
    let props = { tab, code, group, next, prev };

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) => group?.ch?.includes(k)))
    }

    const predict = json.read(dir.stock.predAll);

    const meta = json.read(dir.stock.meta);
    const Price = json.read(dir.stock.all);
    const index = json.read(dir.stock.light.index).data;
    const Induty = json.read(dir.stock.light.induty).data;

    meta.data = Filter(meta.data);
    const price = Filter(Price);
    const induty = Filter(Induty);
    const earn = group?.ch?.map(code => {
        const data = json.read(dir.stock.earn(code)).data.filter(e => e.data);
        const equity = data.map(e => e?.equity).sum();
        const revenue = data.map(e => e?.revenue).sum();
        const profit = data.map(e => e?.profit).sum();
        return { code, equity, revenue, profit };
    }) || []
    if (tab == 'share') {
        const share = json.read(dir.stock.chart.share(code));
        props = { ...props, share };
    }

    const title = group?.n ? `${group?.n}그룹 : 오떨` : null;
    props = {
        ...props,
        title,
        index, induty,
        predict,
        meta, price, earn
    };
    return { props }
}

function MetaTable({
    group, meta, price, code, earn, groupPrice
}) {
    if (!group) return;

    const groupEarn = {
        equity: earn?.map(e => e?.equity)?.sum(),
        revenue: earn?.map(e => e?.revenue)?.sum(),
        profit: earn?.map(e => e?.profit)?.sum()
    };
    // const last = groupPrice?.priceRaw?.data?.slice(-1)?.find(e => true)?.c;

    const amount = group?.ch?.map(e => meta[e]?.a)?.sum();
    const BPS = groupEarn.equity / amount;
    return <div className={styles.meta}>
        <table><tbody>
            <tr><th>시가총액</th><td>{Price(group?.c)}</td></tr>
            {/* <tr><th>수정주가</th><td>{Num(last)}</td></tr> */}
            <tr><th>종목 수</th><td>{group?.ch?.length}</td></tr>
            <tr>
                {/* <th>대표주</th>
                <td>
                    <Link href={`/stock/${first?.code}`}>
                        {meta[first?.code]?.n}
                    </Link>
                </td> */}
            </tr>
        </tbody></table>
    </div>;
}

const prices = {};
function Group({
    next, prev, group, tab,
    meta, price, code, index, induty, earn, share
}) {
    const router = useRouter();
    const [load, setLoad] = useState({ price: true });
    const [groupPrice, setGroupPrice] = useState([]);

    const props = { group, tab, meta, price, earn, share, index, induty, router, code, load, setLoad, groupPrice };
    const query = ['price', 'earn', 'share'];
    const names = ['주가정보', '실적정보', '출자구조'];

    async function fetchPrice() {
        console.time('groupPriceLoad');
        setLoad({ price: true });
        if (prices[code]) {
            setGroupPrice(prices[code]);
        } else {
            prices[code] = {};
            await api.json.read({
                url: dir.stock.groups.price(code)
            }).then(price => {
                prices[code] = price.data;
                setGroupPrice(price.data);
            })
        }
        setLoad({ price: false });
        console.timeEnd('groupPriceLoad');
    }

    useEffect(() => {
        if (tab == 'price') fetchPrice();
    }, [code, tab]);

    if (!group?.n) return <>그룹 정보가 없습니다.</>;
    return <>
        <div className={styles.nextprev}>
            {prev ? <Link href={`/group/${prev}`}>
                <span className='fa fa-chevron-left' />&nbsp;
                {prev} 그룹
            </Link> : <span></span>}
            {next ? <Link href={`/group/${next}`}>
                {next} 그룹&nbsp;
                <span className='fa fa-chevron-right' />
            </Link> : ''}
        </div>
        <div>
            <h2 className={styles.title}>{code}그룹</h2>
            <hr />
            <GroupFold {...props} />
            <MetaTable {...props} />
        </div>
        <hr />
        <ToggleQuery query={query} names={names} />
        {tab == 'price' ? <div className={styles.groupPrice}>
            <GroupPriceElement {...props} />
        </div> : tab == 'earn' ? '' : <div className=''>
            <GroupShareElement {...props} />
        </div>
        }
    </>;
}

export default Group;