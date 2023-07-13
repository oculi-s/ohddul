import styles from '$/Stock/StockHead.module.scss';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dt from '@/module/dt';
import FavStar from '#/baseStock/FavStar';
import PredBar from '#/baseStock/PredBar';
import '@/module/array';
import { Loading } from '#/base/base';

export function Open({ uid, load, ban, time, view, setView }) {
    return <span className={styles.open}>
        {ban ? <p className='des red'>거래정지 주식입니다.</p>
            : load?.pred ? '...'
                : dt.pred(time) ? <button
                    className={`fa fa-chevron-down ${view ? styles.up : ''}`}
                    onClick={e => {
                        if (uid) {
                            setView(!view);
                        } else {
                            alert('로그인 후 이용해주세요')
                        }
                    }}
                >
                    &nbsp;오떨 맞추기
                </button>
                    : <p className='des'>
                        예측완료 : {dt.toString(time, { time: 1, day: 1 })}
                    </p>}
    </span>;
}

function StockHead({
    code, last, ban,
    stockMeta,
    userPred, loadUser: load, setPred, session
}) {
    const name = stockMeta?.n;
    const type = stockMeta?.t;

    const uid = session?.user?.uid;
    const queue = userPred?.queue;
    queue?.sort(dt.sort)
    let orig = queue?.find(e => e.c == code)?.d;
    let bar = dt.pred(orig);
    const [time, setTime] = useState(orig);
    const [view, setView] = useState(0);

    useEffect(() => {
        orig = queue?.find(e => e.c == code)?.d;
        bar = dt.pred(orig);
        setTime(orig);
    }, [code]);

    const props = {
        setPred, setView, setTime, load,
        name, code, last,
    };
    if (!name) return <></>;
    return <>
        <div className={styles.head}>
            <h2 className={ban ? styles.ban : ''}>
                <FavStar {...props} />
                <Link href={'/stock/' + code}>{name}</Link>
                <span
                    className={`${styles.market} ${styles[type == "K" ? 'k' : 'q']}`}
                    title={type == "K" ? "코스피(유가증권)" : "코스닥"}
                ></span>
            </h2>
            {load.pred
                ? <Loading right={70} size={25} />
                : <Open {...{ uid, ban, time: orig, view, setView }} />
            }
        </div>
        {uid && bar && !ban &&
            <div className={`${styles.slide} ${view ? styles.view : ''}`}>
                <div>
                    <div className={styles.fade}>
                        <PredBar {...props} />
                    </div>
                </div>
            </div>}
    </>;
}

export default StockHead;