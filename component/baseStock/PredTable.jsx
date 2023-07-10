import styles from '$/Profile/Pred.module.scss';
import { Color, Num, Per } from "@/module/ba";
import Link from "next/link";
import dt from '@/module/dt';
import { useEffect, useRef } from 'react';

export function QueueTable({ queue, meta, by = 'stock', ids }) {
    queue = queue?.map((e, i) => {
        const { t, c, d, o, pr, od, at, uid } = e;
        // console.log(dt.parse(dt.scoring(at || d)))
        const ref = useRef();
        var cnt = 0;
        useEffect(() => {
            let time = dt.scoring(at || d) - dt.num();
            if (ref.current) {
                const e = ref?.current;
                if (time >= 0) {
                    e.innerHTML = `-${dt.duration(time, 'D일 HH:mm:ss')}`
                } else {
                    e.innerHTML = `대기중...`;
                }
                setInterval(() => {
                    const dots = Array(cnt++ % 3 + 1).fill('.').join('');
                    time -= 1000;
                    if (e) {
                        if (time >= 0) {
                            e.innerHTML = `-${dt.duration(time, 'D일 HH:mm:ss')}`
                        } else {
                            e.innerHTML = `대기중${dots}`;
                        }
                    }
                }, 1000);
            }
        }, [])
        return <tr key={`pred${i}`}>
            <th>{by == 'stock' ?
                <Link href={`/stock/${meta[c]?.n}`}>{meta[c]?.n}</Link>
                : <Link href={`/profile/${ids?.index[uid]}`}>{ids?.index[uid]}</Link>
            }</th>
            <td>{t == 'od' ? '오떨' : '가격'}</td>
            {t == 'pr'
                ? <>
                    {/* <td>{dt.parse(at, 'M월D일')}</td> */}
                    <td>{Num(pr)}<span className='mh'>&nbsp;</span><br className='ph' />
                        <span className={Color(pr, o)}>({Per(pr, o)})</span>
                    </td>
                </>
                : <td>
                    <span className={`fa fa-chevron-${od == 1 ? 'up red' : 'down blue'}`} />
                </td>
            }
            <td><span className='des'>{dt.parse(d, 'M월D일 HH:mm')}</span></td>
            <td><span className='des' ref={ref}></span></td>
        </tr>;
    });
    return <table className={styles.queueTable}>
        <colgroup>
            <col width={'20%'} />
            <col width={'15%'} />
        </colgroup>
        <thead>
            <tr>
                <th>{by == 'stock' ? '종목' : '유저'}</th>
                <th><span className='mh'>예측</span>종류</th>
                {/* <th colSpan={2}>예측</th> */}
                <th>예측</th>
                <th><span className='mh'>예측</span>시간</th>
                <th>채점<span className='mh'>시간</span></th>
            </tr>
        </thead>
        <tbody>{queue}</tbody>
    </table>
}