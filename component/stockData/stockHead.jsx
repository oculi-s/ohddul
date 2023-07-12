import styles from '$/Stock/StockHead.module.scss';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dt from '@/module/dt';
import FavStar from '#/baseStock/FavStar';
import { useSession } from 'next-auth/react';
import { Loading } from '#/base/base';
import PredBar from '#/common/PredBar';
import '@/module/array';

export function Open({ status, ban, time, view, setView }) {
    return <span className={styles.open}>
        {ban ?
            <p className='des red'>거래정지 주식입니다.</p>
            : status == 'loading'
                ? <Loading small={true} />
                : dt.pred(time)
                    ? <button
                        className={`fa fa-chevron-down ${view ? styles.up : ''}`}
                        onClick={e => {
                            if (status == 'authenticated') {
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
    code, last, stockMeta, ban,
}) {
    const { data: session, status, update } = useSession();
    const queue = session?.user?.queue?.qsort(dt.sort);
    const defTime = queue?.find(e => e.c == code)?.d;
    const can = dt.pred(defTime);
    const [time, setTime] = useState(defTime);
    const [bar, setBar] = useState(can);

    const name = stockMeta?.n;
    const type = stockMeta?.t;
    const [view, setView] = useState(0);

    useEffect(() => {
        console.log('predBar 렌더링중');
        const queue = session?.user?.queue?.qsort(dt.sort);
        const defTime = queue?.find(e => e.c == code)?.d;
        const can = dt.pred(defTime);
        setTime(defTime);
        setBar(can);
    }, [code, session?.user?.queue])

    const props = {
        update,
        name, code, last, setView,
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
            <Open {...{ status, ban, time, view, setView }} />
        </div>
        {status == 'authenticated' && bar && !ban &&
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