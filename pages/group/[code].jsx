import styles from '$/Group/Group.module.scss'
import { useRouter } from "next/router";
import Link from "next/link";
import GroupFold from "#/stockFold/GroupFold";
import ToggleTab from '#/base/ToggleTab';
import Help from '#/base/Help';

import { priceHelp } from '#/group/HelpDescription';
import PriceElement from '#/group/groupPrice';
import { bpsHelp } from '#/stockData/HelpDescription';

import { Num, Price } from "@/module/ba";
import dir from '@/module/dir';
import json from '@/module/json';
import container from "@/container/light";
import { CrawlUser } from '@/module/prop/props';

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
    const code = ctx.query?.code;
    const aside = json.read(dir.stock.light.aside);
    const group = json.read(dir.stock.group).data[code] || {};

    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) => group?.child?.includes(k)))
    }
    const predict = json.read(dir.stock.predAll);
    const userMeta = json.read(dir.user.meta);

    const Meta = json.read(dir.stock.meta).data;
    const Price = json.read(dir.stock.all);
    const index = json.read(dir.stock.induty);
    const induty = json.read(dir.stock.dart.induty);

    const meta = Filter(Meta);
    const price = Filter(Price);
    induty.data = Filter(induty.data);
    const earn = group?.child?.map(code => {
        const data = json.read(dir.stock.earn(code)).data.filter(e => e.data);
        const equity = data.map(e => e?.equity).sum();
        const revenue = data.map(e => e?.revenue).sum();
        const profit = data.map(e => e?.profit).sum();
        return { code, equity, revenue, profit };
    }) || []
    const share = group?.child?.map(e =>
        [e, json.read(dir.stock.share(e)).data]
    ) || []
    let props = {
        code, aside,
        group, index, induty,
        userMeta,
        predict,
        meta, price, earn, share
    };
    await CrawlUser(ctx, props);
    return { props }
}

const MetaTable = ({
    group, meta, price, code, earn
}) => {
    group.light = true;
    meta.light = true;
    if (!group) return;
    const groupAsset = group?.asset;

    const groupEarn = {
        equity: earn?.map(e => e?.equity)?.sum(),
        revenue: earn?.map(e => e?.revenue)?.sum(),
        profit: earn?.map(e => e?.profit)?.sum()
    }
    const priceTotal = group?.price;
    const groupPrice = group?.child
        ?.map(e => ({ code: e, c: meta[e]?.a * price[e]?.c }))
        ?.sort((b, a) => a.c - b.c);
    const groupClose = groupPrice?.map(e => e?.c).sum() / group?.child?.map(e => meta[e]?.a).sum();
    const first = groupPrice?.find(e => true);

    const amount = group?.child?.map(e => meta[e]?.a)?.sum();
    const BPS = groupEarn.equity / amount;
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
    if (!props.group) return;
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

export default container(Index);