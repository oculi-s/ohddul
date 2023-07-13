import { getBg, getRank } from '#/User';
import styles from '$/Profile/Header.module.scss'
import { Div, Int } from '@/module/ba';
import { Loading } from '#/base/base';
import scss from '$/variables.module.scss';

/**
 * Profile에서 curtain까지 전부 다룸
 */
export default function Header({ id, userMeta: meta, userPred: pred, loadUser: load }) {
    const [prev, cur, next] = getRank(meta?.rank);
    const Lazy = (data, L = <Loading size={15} />) => load?.meta ? L : data;
    const queue = pred?.queue;
    const data = pred?.data;
    const dataLen = data?.length || 0;
    const queueLen = queue?.length || 0;
    const right = data?.filter(e => e.v >= 0).length;
    const odDataLen = data?.filter(e => e.t == 'od')?.length || 0;
    const prDataLen = data?.filter(e => e.t == 'pr')?.length || 0;
    const odQueueLen = queue?.filter(e => e.t == 'od')?.length || 0;
    const prQueueLen = queue?.filter(e => e.t == 'pr')?.length || 0;
    const odRight = data?.filter(e => e.t == 'od')?.filter(e => e.v >= 0).length;
    const prRight = data?.filter(e => e.t == 'pr')?.filter(e => e.v >= 0).length;
    const bg = getBg(cur.color);
    return (
        <div className={styles.profile}>
            <div
                className={styles.curtain}
                style={{ background: `linear-gradient(180deg, ${scss[cur.color]}, transparent)` }}
            />
            <h2 className={styles.id}>
                {load?.meta ? <Loading inline={true} size={40} />
                    : <span
                        className={cur.color}
                        ranknum={cur.num}
                        style={{ backgroundImage: `url(${bg.src})` }}>
                    </span>}
                {id}
            </h2>
            <div className={cur.color}>
                {Lazy(cur.color == 'unranked' ?
                    <b>IRON {Int(meta?.rank)}</b> :
                    <b>{cur.color.slice(0, 1).toUpperCase() + cur.num} {Int(meta?.rank)}</b>)}
            </div>
            <table className={`${styles.metaTable} fixed`}>
                <tbody>
                    <tr><th></th><th>오/떨</th><th>가격</th></tr>
                    <tr>
                        <th>예측완료</th>
                        <td>{Lazy(odDataLen, '...')}개</td>
                        <td>{Lazy(prDataLen, '...')}개</td>
                    </tr>
                    <tr>
                        <th>채점대기</th>
                        <td>{Lazy(odQueueLen, '...')}개</td>
                        <td>{Lazy(prQueueLen, '...')}개</td>
                    </tr>
                    <tr><th rowSpan={2}>적중률</th>
                        <td>
                            {Lazy(Div(odRight, odDataLen), '...%')}<br />
                            ({Lazy(odRight, '...')}/{Lazy(odDataLen, '...')})
                        </td>
                        <td>
                            {Lazy(Div(prRight, prDataLen), '...%')}<br />
                            ({Lazy(prRight, '...')}/{Lazy(prDataLen, '...')})
                        </td>
                    </tr>
                    <tr><td colSpan={2}>
                        {Lazy(Div(right, dataLen), '...%')}&nbsp;
                        ({Lazy(right, '...')}/{Lazy(dataLen, '...')})
                    </td></tr>
                </tbody>
            </table>
        </div>
    );
}