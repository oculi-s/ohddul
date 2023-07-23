import Link from 'next/link';
import { Price, Num, Div, Per, Color } from '@/module/ba';
import Fold from '#/base/Fold';
import '@/module/array'
import FavStar from '#/baseStock/FavStar';
import styles from '$/Base/Fold.module.scss';
import { useState } from 'react';
import { Bar } from '#/base/base';
import IndutyImg from '@/public/induty/Default';

/**
 * json to table과 재귀함수 이용해서 만들었다가
 * 데이터 구조 바꾸고, 재귀함수 시간 문제 때문에 폐기하고
 * 
 * 2023.07.03 원점에서 다시 제작
 */
function IndutyFold({
    meta, code, price,
    induty, index,
    User, setUser,
}) {
    meta = meta?.data || meta;
    if (!induty) return;
    code = induty[code] || code;
    let parent;
    if (code == '_');
    else if (code.length == 1) parent = '_';
    else if (code.length == 3) parent = code[0];
    else parent = code.slice(0, -1);
    const data = index[code] || index;
    if (!data) return;
    const child = Object.keys(index)?.filter(e => {
        if (e == '_') return 0;
        if (code == '_') return e.length == 1;
        if (code.length == 1) return e.slice(0, -2) == code;
        return e.slice(0, -1) == code
    })?.qsort((b, a) => index[a]?.p - index[b]?.p);
    const stock = Object.keys(meta).filter(e => induty[e] == code)
        ?.filter(e => meta[e]?.a && price[e]?.c)
        ?.qsort((b, a) => meta[a]?.a * price[a]?.c - meta[b]?.a * price[b]?.c);
    const len = child?.length + stock?.length + 2;

    const name = <>
        <h3>
            <Link href={`/induty/${code == '_' ? '' : data?.n}`}>
                <IndutyImg name={data?.n} />
                <span>{data?.n}</span>
            </Link>
        </h3>
        <p>{data?.c} 종목 {data?.p ? <>시총 : ({Price(data?.p, 0)})</> : ''}</p>
    </>;
    const Induty = ({ e, br = false, price = true }) => {
        const n = e == '_' ? '' : index[e]?.n;
        return <span>
            <Link href={`/induty/${n}`}>{index[e]?.n}</Link>
            {br ? <br /> : <> </>}
            <span className={styles.cnt}>
                ({index[e]?.c}개
                {price ? `, ${Div(index[e]?.p, data?.p)}` : ""}
                )
            </span>
        </span>;
    }
    const [view, setView] = useState(false);
    const body = <>
        <tr className='th'>
            {parent ? <th rowSpan={len} align='center'>
                <Induty e={parent} br={true} price={false} />
            </th> : ""}
            <th rowSpan={len} align='center'>
                <Induty e={code} br={true} price={false} />
            </th>
        </tr>
        {child.map(e => <tr key={e} className='th'>
            <th colSpan={3} align='center' style={{ position: 'relative' }}>
                <Bar width={Div(index[e]?.p, index[code]?.p, 3)} />
                <Induty e={e} />
            </th>
        </tr>)}
        {stock?.length ? <tr className='th' align='center'>
            <th>종목</th>
            <th>전일종가</th>
            <th>시총</th>
        </tr> : ""}
        {stock.map(code => {
            const c = price[code]?.c;
            const p = price[code]?.p;
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
                    {Num(c)}&nbsp;
                    <span className={`des ${Color(c - p)}`}>({Per(c, p)})</span>
                </td>
                <td>{Price(price[code]?.c * meta[code]?.a)}</td>
            </tr>;
        })}
    </>;
    const props = { name, body, view, setView };
    return <div className={styles.induty}>
        <Fold {...props} />
    </div>
}

export default IndutyFold;