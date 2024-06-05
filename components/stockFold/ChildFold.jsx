import styles from '$/Base/Fold.module.scss';
import Fold from '@/components/base/Fold';
import Help from '@/components/base/Help';
import FavStar from '@/components/baseStock/FavStar';
import '@/module/array';
import { Color, Num, Per, Price } from '@/module/ba';
import Link from 'next/link';
import { useState } from 'react';

/**
 * 데이터로 전체 group데이터를 가져올게 아니고
 * 데이터를 원하는 그룹의 데이터만 입력
 */
function ChildFold({
    meta, price, child, induty, index,
    User, setUser
}) {
    meta = meta?.data || meta;
    if (!child) return;
    const priceDict = Object.fromEntries(child?.map(e => [e, meta[e]?.a * price[e]?.c]));
    const priceSum = Object.values(priceDict).sum();
    const name = <>
        <h3>계열회사<Help title={'계열회사'} span={'공시대상 기업집단은 아니지만 서로 지분관계가 있는 회사'} /></h3>
        <p>{child.length} 종목 시총 : ({Price(priceSum)})</p>
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
    const body = child
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
    return <div className={styles.induty}>
        <Fold {...props} />
    </div>
}

export default ChildFold;