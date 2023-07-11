import styles from '$/Profile/Pred.module.scss';
import { Color, Num, Per } from "@/module/ba";
import Link from "next/link";
import dt from '@/module/dt';
import { useEffect, useRef, useState } from 'react';

/**
 * 주의할 점
 * 1. useEffect가 루프 내부로 들어가면 오류가 잘 뜸. 그냥 ref 배열을 사용하는 편이 좋다.
 * 2. setinterval을 통해 남은 시간을 표현할 때 hydrated이 되었는지 확인하는 과정이 필요함.
 * intv[i]를 이용하면 된다.
 */
export function QueueTable({ queue, meta, by = 'stock', ids }) {
    const ref = useRef([]);
    const [intv, setIntv] = useState([]);
    useEffect(() => {
        queue?.forEach((q, i) => {
            var cnt = 0;
            const { at, d } = q;
            const e = ref?.current[i];
            if (!e) return;
            let time = dt.scoring(at || d) - dt.num();
            if (time >= 0) {
                e.innerHTML = `-${dt.duration(time, 'D일 HH:mm:ss')}`
            } else {
                e.innerHTML = `대기중...`;
            }
            if (intv[i]) return;
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
            setIntv(e => { e[i] = true; return e; });
        })
    }, [queue])
    const queueBody = queue?.map((e, i) => {
        const { t, c, d, o, pr, od, at, uid } = e;
        // console.log(dt.parse(dt.scoring(at || d)))
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
            <td><span className='des' ref={e => { ref.current[i] = e }}></span></td>
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
        <tbody>{queueBody}</tbody>
    </table>
}