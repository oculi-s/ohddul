import styles from '$/Stock/StockHead.module.scss';
import { Loading } from '@/components/base/base';
import FavStar from '@/components/baseStock/FavStar';
import PredBar from '@/components/baseStock/PredBar';
import '@/module/array';
import dt from '@/module/dt';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    uid,
    code, last, ban,
    stockMeta,
    userPred, loadUser: load, setPred
}) {
    const name = stockMeta?.n;
    const type = stockMeta?.t;

    const queue = userPred?.queue;
    queue?.sort(dt.sort)
    let orig = queue?.find(e => e.code == code)?.d;
    let bar = dt.pred(orig);
    const [time, setTime] = useState(orig);
    const [view, setView] = useState(0);

    useEffect(() => {
        orig = queue?.find(e => e.code == code)?.d;
        bar = dt.pred(orig);
        setTime(orig);
    }, [code]);

    const props = {
        uid,
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