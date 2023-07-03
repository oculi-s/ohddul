import styles from '$/Group/Group.module.scss'
import { useRouter } from "next/router";
import Link from "next/link";
import GroupFold from "#/stockFold/GroupFold";
import ToggleTab from '#/base/ToggleTab';
import Help from '#/base/Help';

import { priceHelp } from '#/group/HelpDescription';
import PriceElement from '#/group/groupPrice';
import { bpsHelp, epsHelp } from '#/stockData/HelpDescription';

import { Num, Price } from "@/module/ba";
import dir from '@/module/dir';
import json from '@/module/json';

export async function getServerSideProps(ctx) {
    const code = ctx.query?.code;
    const group = json.read(dir.stock.group).data[code];

    const meta = json.read(dir.stock.meta, { data: {}, index: {} });
    const price = json.read(dir.stock.all);
    const predict = json.read(dir.stock.predAll);
    const userMeta = json.read(dir.user.meta);
    const index = json.read(dir.stock.induty);
    const induty = json.read(dir.stock.dart.induty);

    const groupEarn = group?.child?.map(code => {
        const data = json.read(dir.stock.earn(code)).data.filter(e => e.data);
        const equity = data.map(e => e?.equity).sum();
        const revenue = data.map(e => e?.revenue).sum();
        const profit = data.map(e => e?.profit).sum();
        return { code, equity, revenue, profit };
    })
    const groupShare = group?.child?.map(e =>
        [e, json.read(dir.stock.share(e)).data]
    )
    let props = {
        code,
        price, meta, group, index, induty,
        userMeta,
        predict,
        groupEarn, groupShare
    };

    let userInfo = (await getSession(ctx))?.user;
    if (userInfo) {
        const { uid } = userInfo;
        const userPred = json.read(dir.user.pred(uid), { queue: [], data: [] });
        const userFavs = json.read(dir.user.fav(uid), []);
        props = { ...props, userPred, userFavs };
    }
    return { props }
}

const MetaTable = ({
    group, meta, price, code, groupEarn
}) => {
    meta = meta?.data;
    if (!group) return;
    const groupAsset = group?.asset;

    const earn = {
        equity: groupEarn?.map(e => e?.equity)?.sum(),
        revenue: groupEarn?.map(e => e?.revenue)?.sum(),
        profit: groupEarn?.map(e => e?.profit)?.sum()
    }
    const priceTotal = group?.price;
    const groupPrice = group?.child
        ?.map(e => ({ code: e, c: meta[e]?.a * price[e]?.c }))
        ?.sort((b, a) => a.c - b.c);
    const groupClose = groupPrice?.map(e => e?.c).sum() / group.child.map(e => meta[e]?.a).sum();
    const first = groupPrice[0];

    const amount = group?.child?.map(e => meta[e]?.a)?.sum();
    console.log(amount);
    const BPS = earn.equity / amount;
    return <div className={styles.meta}>
        <table><tbody>
            <tr><th>시가총액</th><td>{Price(priceTotal)}</td></tr>
            <tr><th>수정주가<Help {...priceHelp} /></th><td>{Num(groupClose)}</td></tr>
            <tr><th>BPS<Help {...bpsHelp} /></th><td>{Num(BPS)}</td></tr>
            <tr><th>종목 수</th><td>{group?.child?.length}</td></tr>
            <tr>
                <th>대표주</th>
                <td>
                    <Link href={`/stock/${first?.code}`}>
                        {meta[first?.code]?.n}
                    </Link>
                </td>
            </tr>
        </tbody></table>
    </div>
}

const Index = (props) => {
    const router = useRouter();
    const { code } = router.query;
    props = { ...props, router, code };
    const names = ['요약정보', '실적정보', '출자정보']
    const datas = [
        <div key={0}>
            <PriceElement {...props} />
        </div>,
        <div key={1}>
            <h3>그룹사 상세정보</h3>
        </div>
    ]
    return <>
        <div>
            <h2 className={styles.title}>{code}그룹</h2>
            <hr />
            <GroupFold {...props} />
            <MetaTable {...props} />
        </div>
        <hr />
        <div style={{ height: 300 }}>
            <ToggleTab names={names} datas={datas} />
        </div>
    </>
}

import container from "@/container";
import { getSession } from 'next-auth/react';
export default container(Index);