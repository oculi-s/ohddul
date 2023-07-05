import Link from 'next/link';
import { Price, Big, Num } from '@/module/ba';
import Fold from '#/base/Fold';
import '@/module/array'
import FavStar from '#/base/FavStar';
import styles from '$/Base/Fold.module.scss';

/**
 * json to table과 재귀함수 이용해서 만들었다가
 * 데이터 구조 바꾸고, 재귀함수 시간 문제 때문에 폐기하고
 * 
 * 2023.07.03 원점에서 다시 제작
 */
const IndutyFold = ({
    meta, code, price, induty, index, router,
    folded = true, User, setUser,
}) => {
    meta = meta?.data || meta;
    if (!induty) return;
    const indutyCode = Big(induty[code] || code);
    const parCode = indutyCode?.slice(0, -1);
    const indutyNum = indutyCode?.slice(1);
    const data = index[indutyCode] || index;
    if (!data) return;
    const child = Object.keys(index)?.filter(e => e.slice(0, -1) == indutyCode);
    const stock = Object.keys(meta).filter(e => induty[e] == indutyNum)
        ?.filter(e => meta[e]?.a && price[e]?.c)
        ?.sort((b, a) => meta[a]?.a * price[a]?.c - meta[b]?.a * price[b]?.c);
    const len = child?.length + stock?.length + 2;

    const total = stock.map(e => meta[e]?.a * price[e]?.c || 0).sum();
    const name = <>
        <h3 style={{ margin: "10px auto" }}><Link href={`/induty/${indutyNum}`}>{data?.n}</Link></h3>
        <p>{data?.c} 종목 시총 : ({Price(total)}) ROE평균 : </p>
    </>
    const Induty = ({ e }) => <>
        <Link href={`/induty/${e.slice(1)}`}>{index[e]?.n}</Link>
        <p className={styles.cnt}>({index[e]?.c}개)</p>
    </>

    const body = <>
        <tr>
            {index[parCode] && <th rowSpan={len} align='center'><Induty e={parCode} /></th>}
            <th rowSpan={len} align='center'><Induty e={indutyCode} /></th>
        </tr>
        {child.map(e =>
            <tr key={e}>
                <th colSpan={3} align='center'><Induty e={e} /></th>
            </tr>
        )}
        <tr>
            <th align='center'>종목</th>
            <th align='center'>전일종가</th>
            <th align='center'>시총</th>
        </tr>
        {stock.map(code =>
            <tr key={code}>
                <th className={styles.stock}>
                    <FavStar {...{ code, User, setUser }} />
                    <Link href={`/stock/${code}`}>{meta[code]?.n}</Link>
                </th>
                <td>{Num(price[code]?.c)}</td>
                <td>{Price(price[code]?.c * meta[code]?.a)}</td>
            </tr>
        )}
    </>
    const props = { router, name, body, folded };
    return <Fold {...props} />
}

export default IndutyFold;