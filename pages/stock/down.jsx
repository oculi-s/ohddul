/**
 * 이걸로 Pagination을 연습하고 게시판에 적용
 */

import styles from '$/Stock/Sum.module.scss';
import { Pagination } from "@/components/base/Pagination";
import FavStar from "@/components/baseStock/FavStar";
import '@/module/array';
import { Color, Num, Per, Price } from "@/module/ba";
import { stock as dir } from "@/module/dir";
import json from "@/module/json";
import GroupImg from "@/public/group/Default";
import Link from "next/link";

export async function getServerSideProps(ctx) {
    const Meta = json.read(dir.meta).data;
    const Price = json.read(dir.all);
    const group = json.read(dir.group);

    const p = parseInt(ctx?.query?.p || 1);
    const N = parseInt(ctx?.query?.N || 15);
    const T = Object.keys(Meta)?.length || 0;
    const keys = Object.keys(Meta)
        ?.filter(e => Meta[e]?.a && Price[e]?.c)
        ?.filter(e => {
            const v = (Price[e]?.c - Price[e]?.p) / Price[e]?.p;
            return -0.31 <= v && v <= 0.31;
        })
        ?.qsort((a, b) =>
            (Price[a]?.c - Price[a]?.p) * Price[b].p
            - (Price[b]?.c - Price[b]?.p) * Price[a].p
        )
        ?.slice((p - 1) * N, p * N)
    const KeyMap = Object.fromEntries(keys.map(e => [e, 1]));
    const Filter = (data) => {
        return Object.fromEntries(Object.entries(data)
            ?.filter(([k, v]) => KeyMap[k]))
    }
    const meta = Filter(Meta);
    const price = Filter(Price);
    group.index = Filter(group.index);

    const props = { p, N, T, keys, meta, price, group };
    return { props };
}

export default function Down({ p, N, T, keys, meta, price, group }) {
    const body = keys?.map((e, i) => {
        const gname = group?.index[e];
        return <tr key={i}>
            <th align='center' className={styles.num}>{(p - 1) * N + i + 1}</th>
            <th className={styles.stockTh}>
                <FavStar code={e} />
                <Link href={`/stock/${meta[e]?.n}`}>{meta[e]?.n}{meta[e]?.t == 'Q' ? '*' : ''}</Link>
            </th>
            <td>{Price(meta[e]?.a * price[e]?.c)}</td>
            <td>{Num(price[e]?.c)}&nbsp;
                <span
                    className={`${Color(price[e]?.c - price[e]?.p)} des`}
                >
                    ({Per(price[e]?.c, price[e]?.p)})
                </span>
            </td>
            <td>
                <Link href={`/group/${gname}`}>
                    <GroupImg name={gname} />
                </Link>
            </td>
        </tr>
    })
    const data = <table className={`${styles.stockSum} fixed`}>
        <colgroup>
            <col width={10} />
            <col width={80} />
            <col width={30} />
            <col width={40} />
            <col width={30} />
        </colgroup>
        <thead>
            <tr>
                <th>#</th>
                <th>종목명</th>
                <th><span className='ph'>시총</span><span className='mh'>시가총액</span></th>
                <th>종가</th>
                <th>그룹</th>
            </tr>
        </thead>
        <tbody>{body}</tbody>
    </table>

    return <>
        <div className={styles.title}>
            <h2>떨어진종목</h2>
            <Link href={'/stock/up'}>
                오른 종목 보러가기&nbsp;
                <span className='fa fa-chevron-right'></span>
            </Link>
        </div>
        <div className={styles.wrap}>
            <p className='des'>* : 코스닥 종목</p>
            <Pagination {...{ p, N, T, data }} />
        </div>
    </>
}