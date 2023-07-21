import { AlarmSetting, getBg, getRank } from '#/User';
import styles from '$/Profile/Header.module.scss'
import { Div, Int } from '@/module/ba';
import { Loading } from '#/base/base';
import scss from '$/variables.module.scss';
import dt from '@/module/dt';

/**
 * Profile에서 curtain까지 전부 다룸
 */
export default function Header({ id, userMeta: meta, userPred: pred, loadUser: load, mine, uid }) {
    const [prev, cur, next] = getRank(meta?.rank);
    const Lazy = (data, L = <Loading size={15} />) => load?.meta ? L : data;
    const queue = pred?.queue;
    const data = pred?.data;
    // const dataLen = data?.length || 0;
    // const queueLen = queue?.length || 0;
    // const right = data?.filter(e => e.v >= 0).length;
    const odDataLen = data?.filter(e => e.t == 'od')?.length || 0;
    const prDataLen = data?.filter(e => e.t == 'pr')?.length || 0;
    const odQueueLen = queue?.filter(e => e.t == 'od')?.length || 0;
    const prQueueLen = queue?.filter(e => e.t == 'pr')?.length || 0;
    const odRight = data?.filter(e => e.t == 'od')?.filter(e => e.v >= 0).length;
    // const prRight = data?.filter(e => e.t == 'pr')?.filter(e => e.v >= 0).length;
    const bg = getBg(cur.color);
    return (
        <div className={styles.profile}>
            <div
                className={styles.curtain}
                style={{ background: `linear-gradient(180deg, ${scss[cur.color]}, transparent)` }}
            />
            <div className={styles.header}>
                <h2 className={styles.id}>
                    {load?.meta ? <Loading inline={true} size={40} />
                        : <span
                            className={cur.color}
                            ranknum={cur.num}
                            style={{ backgroundImage: `url(${bg.src})` }}>
                        </span>}
                    {id}
                </h2>
                {mine ? <AlarmSetting uid={uid} /> : ''}
            </div>
            <div>
                <div className={cur.color}>
                    {Lazy(cur.color == 'unranked' ?
                        <b>IRON {Int(meta?.rank)}</b> :
                        <b>{cur.color.slice(0, 1).toUpperCase() + cur.num} {Int(meta?.rank)}</b>)}
                </div>
            </div>
            <table className={`${styles.metaTable} fixed`}>
                <thead>
                    <tr><th></th><th>오/떨</th><th>가격</th></tr>
                </thead>
                <tbody>
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
                    <tr><th>오/떨 적중률</th>
                        <td colSpan={2}>
                            {Lazy(Div(odRight, odDataLen), '...%')}&nbsp;
                            ({Lazy(odRight, '...')}/{Lazy(odDataLen, '...')})
                        </td>
                        {/* <td>
                            {Lazy(Div(prRight, prDataLen), '...%')}<br />
                            ({Lazy(prRight, '...')}/{Lazy(prDataLen, '...')})
                        </td> */}
                    </tr>
                    {/* <tr><td colSpan={2}>
                        {Lazy(Div(right, dataLen), '...%')}&nbsp;
                        ({Lazy(right, '...')}/{Lazy(dataLen, '...')})
                    </td></tr> */}
                </tbody>
            </table>
            <div className={styles.meta}>
                <span>가입일 : {dt.toString(meta?.signed || 1, { time: 1, day: 1 })}</span>
            </div>
        </div>
    );
}