import { getBg, getRank } from '#/User';
import styles from '$/Profile/Header.module.scss'
import { useEffect } from 'react'

export const Curtain = ({ rank }) => {
    const [color, num, next] = getRank(rank);
    useEffect(() => {
        document.querySelector('nav').classList.add(`bg-${color}`)
    }, [color])
    return <div
        className={styles.curtain}
        style={{ background: `linear-gradient(180deg, var(--rank-${color}), transparent)` }}
    />
}

const Header = ({ color, num, id }) => {
    const bg = getBg(color);
    return <h2 className={styles.id}>
        <span
            className={color}
            ranknum={num}
            style={{ backgroundImage: `url(${bg.src})` }}>
        </span>
        {id}
    </h2>
}

export const Profile = ({ rank, user, id }) => {
    const [color, num, next] = getRank(rank);

    const props = { color, num, id }
    const queue = user?.pred?.queue;
    let data = user?.pred?.data;
    let ts = rank;
    data = data
        ?.sort(dt.sort)
        ?.map(e => {
            e.value = ts;
            ts -= e.change;
            return e;
        });
    return (
        <div className={styles.profile}>
            <Header {...props} />
            <div className={color}>
                <b>{color.slice(0, 1).toUpperCase() + num} {rank}</b>
            </div>
            <span>
                <p>{data?.length || 0}개 예측완료 {queue?.length || 0}개 대기중</p>
                <p>오/떨 적중 (N/N) 회 (30 %)</p>
                가입일, 최종 접속시간
            </span>
        </div >
    )
}