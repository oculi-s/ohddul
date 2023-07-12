import { getBg, getRank } from '#/User';
import styles from '$/Profile/Header.module.scss'
import { useEffect, useState } from 'react'

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
    const queue = user?.queue;
    let data = user?.pred?.data;
    let ts = rank;
    data = data
        ?.qsort(dt.sort)
        ?.map(e => {
            e.value = ts;
            ts -= e.change;
            return e;
        });
    return (
        <div className={styles.profile}>
            <Header {...props} />
            <div className={color}>
                {color == 'unranked' ?
                    <b>IRON {rank}</b> :
                    <b>{color.slice(0, 1).toUpperCase() + num} {rank}</b>}
            </div>
            <span>
                <p>{data?.length || 0}개 예측완료 {queue?.length || 0}개 대기중</p>
                <p>오/떨 적중 (N/N) 회 (P %)</p>
            </span>
        </div>
    );
}