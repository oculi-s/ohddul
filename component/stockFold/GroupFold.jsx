import Link from 'next/link';
import GroupImg from '@/public/group/Default';
import { Num, Price } from '@/module/ba';
import Fold from '#/base/Fold';
import FavStar from '#/baseStock/FavStar';
import styles from '$/Base/Fold.module.scss'
import '@/module/array';
import { useState } from 'react';

/**
 * 데이터로 전체 group데이터를 가져올게 아니고
 * 데이터를 원하는 그룹의 데이터만 입력
 */
function GroupFold({
    meta, price, group, predict,
    User, setUser
}) {
    meta = meta?.data || meta;
    if (!group) return;
    const gname = group?.n;
    if (!gname) return;
    const priceDict = Object.fromEntries(group?.ch.map(e => [e, meta[e]?.a * price[e]?.c]));
    const priceSum = Object.values(priceDict).sum();
    const name = <>
        <Link href={`/group/${gname}`}>
            <GroupImg name={gname} />
        </Link>
        <p>{gname}그룹 시총 : ({Price(priceSum)})</p>
    </>;
    const head = <>
        <tr>
            <th>이름</th>
            <th>전일종가</th>
            <th>시총</th>
            <th>예측수</th>
            <th>정답률</th>
        </tr>
    </>;

    const [view, setView] = useState(false);
    const body = group?.ch
        .filter(code => meta[code])
        .sort((a, b) => (priceDict[b] || 0) - (priceDict[a] || 0))
        .map((code) => {
            const cnt = predict[code]?.queue || 0 + predict[code]?.data || 0;
            return <tr key={code}>
                <th className={styles.stock}>
                    <FavStar {...{ code, User, setUser }} />
                    <Link
                        href={`/stock/${meta[code]?.n}`}
                        onClick={e => setView(false)}
                    >{meta[code]?.n}
                    </Link>
                </th>
                <td>{Num(price[code]?.c)}</td>
                <td>{Price(priceDict[code])}</td>
                <td>{cnt}</td>
                <td>{(predict[code]?.right || 0 / cnt) || 0}%</td>
            </tr>;
        });
    const props = { name, head, body, view, setView };
    return <Fold {...props} />;
}

export default GroupFold;