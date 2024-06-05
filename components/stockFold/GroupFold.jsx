import styles from '$/Base/Fold.module.scss';
import Fold from '@/components/base/Fold';
import FavStar from '@/components/baseStock/FavStar';
import '@/module/array';
import { Color, Num, Per, Price } from '@/module/ba';
import GroupImg from '@/public/group/Default';
import Link from 'next/link';
import { useState } from 'react';

/**
 * 데이터로 전체 group데이터를 가져올게 아니고
 * 데이터를 원하는 그룹의 데이터만 입력
 */
function GroupFold({
    meta, price, group, induty, index, predict,
    User, setUser
}) {
    meta = meta?.data || meta;
    if (!group) return;
    const gname = group?.n;
    if (!gname) return;
    const priceDict = Object.fromEntries(group?.ch.map(e => [e, meta[e]?.a * price[e]?.c]));
    const name = <>
        <Link href={`/group/${gname}`}>
            <GroupImg name={gname} />
        </Link>
        <p>{gname}그룹 시총 : ({Price(group?.c)})</p>
    </>;
    const head = <>
        <tr>
            <th>이름</th>
            <th>전일종가</th>
            <th>시총</th>
            <th>업종</th>
        </tr>
    </>;

    const [view, setView] = useState(false);
    const body = group?.ch
        .filter(code => meta[code])
        .qsort((a, b) => (priceDict[b] || 0) - (priceDict[a] || 0))
        .map((code) => {
            // const cnt = predict[code]?.queue || 0 + predict[code]?.data || 0;
            const c = price[code]?.c;
            const p = price[code]?.p;
            const icode = induty[code];
            const iname = index[icode]?.n;
            return <tr key={code}>
                <th className={styles.stock}>
                    <FavStar {...{ code, User, setUser }} />
                    <Link
                        href={`/stock/${meta[code]?.n}`}
                        onClick={e => setView(false)}
                    >{meta[code]?.n}
                    </Link>
                </th>
                <td>
                    {Num(price[code]?.c)}&nbsp;
                    <span className={`des ${Color(c - p)}`}>
                        ({Per(c, p)})
                    </span>
                </td>
                <td>{Price(priceDict[code])}</td>
                <td className={styles.ind}>
                    <Link href={`/induty/${iname}`}>{iname}</Link>
                </td>
            </tr>;
        });
    const props = { name, head, body, view, setView };
    return <div className={styles.group}>
        <Fold {...props} />
    </div>
}

export default GroupFold;