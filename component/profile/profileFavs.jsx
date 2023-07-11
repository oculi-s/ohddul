import FavStar from "#/baseStock/FavStar";
import PredBar from "#/common/PredBar";
import { Color, Num, Per } from "@/module/ba";
import Link from "next/link";
import { useState } from "react";
import dt from '@/module/dt';
import styles from '$/Profile/Favs.module.scss';
import { Open } from "#/stockData/stockHead";
import { useSession } from "next-auth/react";

export function FavTable({ meta, price, mine, favs }) {
    const { data: session, status } = useSession();
    const queue = session?.user?.queue;
    queue?.sort(dt.sort);
    const head = <tr>
        <th>종목</th>
        <th>가격</th>
        <th>전일비</th>
        <th>예측하기</th>
    </tr>;
    function Rows({ code }) {
        const [view, setView] = useState(false);
        const name = meta[code]?.n;
        const close = price[code]?.c;
        const prev = price[code]?.p;
        const time = queue?.find(e => e.c == code)?.d;
        return <>
            <tr>
                <th>
                    {mine && <FavStar {...{ code }} />}
                    <Link href={`/stock/${name}`}>{name}</Link>
                </th>
                <td>{Num(close)}</td>
                <td className={Color(close - prev)}>{Per(close, prev)}</td>
                <td>{dt.pred(time) ?
                    <p className={styles.open}><Open {...{ status, time, view, setView }} /></p> :
                    <p className="des">예측완료 {dt.parse(time, 'M월D일 HH:mm')}</p>
                }</td>
            </tr>
            {mine && dt.pred(time) &&
                <tr className={`${styles.predBar} ${view ? styles.view : ''}`}>
                    <th colSpan={4}>
                        <PredBar {...{
                            code, last: price[code],
                            name, help: false,
                            view, setView
                        }} />
                    </th>
                </tr>}
        </>;
    }
    return <>
        <table className={styles.favTable}>
            <thead>{head}</thead>
            <tbody>{Object.keys(favs)?.map(code => <Rows code={code} key={code} />)}</tbody>
        </table>
        {!mine && <p className="des">관심종목에 종목을 추가하면 <Link href={'/profile'}>내 프로필</Link>에서 예측바를 통해 바로 예측을 진행할 수 있습니다.</p>}
    </>;
}