import { getBg, getRank } from '#/User';
import styles from '$/Profile/Header.module.scss'
import { useEffect, useState } from 'react'
import api from '@/pages/api';
import dir from '@/module/dir';
import { Div, Int } from '@/module/ba';
import { Loading } from '#/base/base';

export function Curtain({ rank }) {
    const [color, num, next] = getRank(rank);
    useEffect(() => {
        document.querySelector('nav').classList.add(`bg-${color}`);
    }, [color]);
    return <div
        className={styles.curtain}
        style={{ background: `linear-gradient(180deg, var(--rank-${color}), transparent)` }} />;
}

function Header({ color, num, id }) {

}

export function Profile({ user, id }) {
    const [pred, setPred] = useState({ queue: [], data: [] });
    const [meta, setMeta] = useState({ rank: 1000 });
    const [color, num, next] = getRank(meta?.rank);
    const [loading, setLoading] = useState(true);
    const props = { color, num, id };
    useEffect(() => {
        async function fetch() {
            const uid = user?.uid;
            if (uid) {
                setMeta(await api.json.read({ url: dir.user.meta(uid) }));
                setPred(await api.json.read({ url: dir.user.pred(uid) }));
            }
            setLoading(false);
        }
        fetch();
    }, [user])
    const Lazy = (data) => loading ? '...' : data;
    const queue = pred?.queue;
    const data = pred?.data;
    const dataLen = data?.length || 0;
    const queueLen = queue?.length || 0;
    const right = data?.filter(e => e.p >= 0).length;
    const bg = getBg(color);
    return (
        <div className={styles.profile}>
            <h2 className={styles.id}>
                {loading ? <Loading small={true} />
                    : <span
                        className={color}
                        ranknum={num}
                        style={{ backgroundImage: `url(${bg.src})` }}>
                    </span>}
                {id}
            </h2>
            <table className={styles.metaTable}>
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