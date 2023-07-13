import FavStar from "#/baseStock/FavStar";
import PredBar from "#/baseStock/PredBar";
import { Color, Num, Per } from "@/module/ba";
import Link from "next/link";
import { useState } from "react";
import dt from '@/module/dt';
import styles from '$/Profile/Favs.module.scss';
import { Open } from "#/stockData/stockHead";

export function FavTable({
    meta, price, mine, favs, ban, uid,
    userPred: pred, setPred, loadUser: load,
}) {
    const codes = Object.keys(favs);
    const queue = pred?.queue;

    function Rows({ code }) {
        const [time, setTime] = useState(queue?.find(e => e.c == code)?.d);
        const [view, setView] = useState(false);
        const name = meta[code]?.n;
        const close = price[code]?.c;
        const prev = price[code]?.p;
        return <>
            <tr>
                <th>
                    {mine && <FavStar {...{ code }} />}
                    <Link href={`/stock/${name}`}>{name}</Link>
                </th>
                <td>{Num(close)}</td>
                <td className={Color(close - prev)}>{Per(close, prev)}</td>
                <td>{ban[code] ?
                    <p className="des red">거래정지</p>
                    : dt.pred(time) ?
                        <p className={styles.open}>
                            <Open {...{ uid, load, time, view, setView }} />
                        </p> :
                        <p className="des">예측완료 {dt.parse(time, 'M월D일 HH:mm')}</p>
                }</td>
            </tr>
            {mine && dt.pred(time) && !ban[code] &&
                <tr className={`${styles.predBar} ${view ? styles.view : ''}`}>
                    <th colSpan={4}>
                        <PredBar {...{
                            uid,
                            setPred, setTime, setView,
                            code, last: price[code],
                            name, help: false,
                        }} />
                    </th>
                </tr>}
        </>;
    }
    const head = <tr>
        <th>종목</th>
        <th>가격</th>
        <th>전일비</th>
        <th>예측하기</th>
    </tr>;
    return <>
        <table className={styles.favTable}>
            <thead>{head}</thead>
            <tbody>{codes?.map(code => <Rows code={code} key={code} />)}</tbody>
        </table>
        {!mine && <p className="des">관심종목에 종목을 추가하면 <Link href={'/profile'}>내 프로필</Link>에서 예측바를 통해 바로 예측을 진행할 수 있습니다.</p>}
    </>;
}