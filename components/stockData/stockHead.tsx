import styles from '$/Stock/StockHead.module.scss';
import FavStar from '@/components/baseStock/FavStar';
import '@/module/array';
import dt from '@/module/dt';
import { StockCloseType, StockMetaLightType } from '@/utils/type';
import cn from 'classnames';
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
}: {
    stockMeta: StockMetaLightType,
    code: string,
    last: StockCloseType,
    uid: string,
    userPred: any,
    setPred: any,
    load: boolean,
    ban: boolean
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
    return (
        <div className='flex justify-between bg-trade-700 p-2'>
            <div className='flex gap-2 justify-start items-center'>
                <div className='flex items-center gap-2'>
                    <FavStar {...props} />
                    <Link href={'/stock/' + code} className='text-xl text-slate-100'>{name}</Link>
                </div>
                <div
                    className={cn('rounded-full w-6 h-6 text-white text-sm flex items-center justify-center', {
                        'bg-emerald-800': type == "K",
                        'bg-rose-700': type == "Q"
                    })}
                    title={type == "K" ? "코스피(유가증권)" : "코스닥"}
                >{type == 'K' ? '유' : '코'}</div>
            </div>
        </div>
    )
}

export default StockHead;