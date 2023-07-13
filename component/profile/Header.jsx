import { getBg, getRank } from '#/User';
import styles from '$/Profile/Header.module.scss'
import { Div, Int } from '@/module/ba';
import { Loading } from '#/base/base';

/**
 * Profile에서 curtain까지 전부 다룸
 */
export default function Header({ userMeta: meta, userPred: pred, loadUser: load }) {
    const [color, num, next] = getRank(meta?.rank);
    const Lazy = (data) => load?.meta ? '...' : data;
    const queue = pred?.queue;
    const data = pred?.data;
    const dataLen = data?.length || 0;
    const queueLen = queue?.length || 0;
    const right = data?.filter(e => e.p >= 0).length;
    const bg = getBg(color);
    return (
        <div className={styles.profile}>
            <div
                className={styles.curtain}
                style={{ background: `linear-gradient(180deg, var(--rank-${color}), transparent)` }}
            />
            <h2 className={styles.id}>
                {load?.meta ? <Loading small={true} inline={true} />
                    : <span
                        className={color}
                        ranknum={num}
                        style={{ backgroundImage: `url(${bg.src})` }}>
                    </span>}
                {meta?.id}
            </h2>
            <table className={`${styles.metaTable} fixed`}>
                <tbody>
                    <tr><th colSpan={2}>
                        <div className={color}>
                            {Lazy(color == 'unranked' ?
                                <b>IRON {Int(meta?.rank)}</b> :
                                <b>{color.slice(0, 1).toUpperCase() + num} {Int(meta?.rank)}</b>)}
                        </div>
                    </th></tr>
                    <tr><th>예측완료</th><td>{Lazy(dataLen)}개</td></tr>
                    <tr><th>채점 대기중</th><td>{Lazy(queueLen)}개</td></tr>
                    <tr><th>적중률</th>
                        <td>
                            {Lazy(Div(right, dataLen))}&nbsp;
                            ({Lazy(right)}/{Lazy(dataLen)})
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}