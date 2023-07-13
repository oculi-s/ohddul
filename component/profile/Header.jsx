import { getBg, getRank } from '#/User';
import styles from '$/Profile/Header.module.scss'
import { useEffect, useState } from 'react'
import { json } from '@/pages/api/xhr';
import dir from '@/module/dir';
import { Div, Int } from '@/module/ba';

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
    const bg = getBg(color);
    return <h2 className={styles.id}>
        <span
            className={color}
            ranknum={num}
            style={{ backgroundImage: `url(${bg.src})` }}>
        </span>
        {id}
    </h2>;
}


export function Profile({ rank, user, id }) {
    const [color, num, next] = getRank(rank);
    const props = { color, num, id };
    const [pred, setPred] = useState({ queue: [], data: [] });
    useEffect(() => {
        async function fetch() {
            setPred(await json.read({ url: dir.user.pred(user?.uid) }));
        }
        fetch();
    }, [])
    const queue = pred?.queue;
    const data = pred?.data;
    const dataLen = data?.length || 0;
    const queueLen = queue?.length || 0;
    const right = data?.filter(e => e.p >= 0).length;
    return (
        <div className={styles.profile}>
            <Header {...props} />
            <table className={styles.metaTable}>
                <tbody>
                    <tr><th colSpan={2}>
                        <div className={color}>
                            {color == 'unranked' ?
                                <b>IRON {Int(rank)}</b> :
                                <b>{color.slice(0, 1).toUpperCase() + num} {rank}</b>}
                        </div>
                    </th></tr>
                    <tr><th>예측완료</th><td>{dataLen}개</td></tr>
                    <tr><th>채점 대기중</th><td>{queueLen}개</td></tr>
                    <tr><th>적중률</th><td>{Div(right, dataLen)}</td></tr>
                </tbody>
            </table>
        </div>
    );
}