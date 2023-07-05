import styles from '$/Stock/Stock.module.scss';
import Link from 'next/link';
import { getRank } from '#/User';
import { Fix, Num } from '@/module/ba';
import dt from '@/module/dt';

const PredTable = ({ stockPredict, userMeta }) => {
    const head = <>
        <tr><th>ID</th><th>오떨</th><th>목표가</th><th>일시</th></tr>
    </>
    const data = stockPredict?.queue?.map((e, i) => {
        const { uid, change, date, ohddul, origin } = e;
        const meta = userMeta[uid];
        if (!meta) return <></>;
        const { id, rank } = meta;
        const [curRank, nextRank] = getRank(rank);
        const target = origin + change;
        let about, od = ohddul || change > 0;
        if (change) about = `${Num(target)} (${Fix(change / origin * 100)}%)`
        else about = `-`
        return (
            <tr key={`pred${i}`}>
                <th className={curRank.slice(0, -1)}>
                    <Link href={`/profile/${id}`}>
                        {id}
                    </Link>
                </th>
                <td>
                    <span
                        className={`fa fa-chevron-${od ? 'up red' : 'down blue'}`}
                        title={od ? '오' : '떨'}
                    />
                </td>
                <td>{about}</td>
                <td>{dt.toString(date, { time: 1 })}</td>
            </tr>
        );
    });
    return (
        <div className={styles.predTable}>
            <table>
                <thead>{head}</thead>
                <tbody>{data}</tbody>
            </table>
        </div>
    )
}

const PredElement = (props) => {
    return <>
        <h3>예측통계</h3>
        <h3>예측모음</h3>
        <PredTable {...props} />
    </>
}

export default PredElement;