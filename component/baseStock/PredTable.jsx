import styles from '$/Profile/Pred.module.scss';
import { Color, Fix, Num, NumFix, Per } from "@/module/ba";
import Link from "next/link";
import dt from '@/module/dt';
import { useEffect, useRef, useState } from 'react';
import { MoreTable } from '#/base/Pagination';

/**
 * 주의할 점
 * 1. useEffect가 루프 내부로 들어가면 오류가 잘 뜸. 그냥 ref 배열을 사용하는 편이 좋다.
 * 2. setinterval을 통해 남은 시간을 표현할 때 hydrated이 되었는지 확인하는 과정이 필요함.
 * intv[i]를 이용하면 된다.
 */
export function QueueTable({ queue, meta, by = 'stock', ids }) {
    const ref = useRef([]);
    const [intv, setIntv] = useState({});
    queue?.sort(dt.lsort);
    useEffect(() => {
        Object.values(intv).forEach(e => clearInterval(e));
        queue?.forEach((q, i) => {
            var cnt = 0;
            const { at, d } = q;
            const e = ref?.current[d];
            if (!e) return;
            let time = dt.scoring(at || d) - dt.num();
            if (time >= 0) {
                e.innerHTML = `-${dt.duration(time, 'D일 HH:mm:ss')}`
            } else {
                e.innerHTML = `대기중...`;
            }
            intv[d] = setInterval(() => {
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
            setIntv(intv);
        })
    }, [queue])
    const queueBody = queue?.map((e, i) => {
        const { t, code, d, o, pr, od, at, uid } = e;
        return <tr key={`pred${i}`}>
            <th className={styles.stock}>
                {by == 'stock' ?
                    <Link href={`/stock/${meta[code]?.n}`}>{meta[code]?.n}</Link>
                    : <Link href={`/profile/${ids?.index[uid]}`}>{ids?.index[uid]}</Link>
                }
            </th>
            {/* <td>{t == 'od' ? '오떨' : '가격'}</td> */}
            {t == 'pr'
                ? <>
                    <td>{Num(pr)}<span className='mh'>&nbsp;</span><br className='ph' />
                        <span className={Color(pr, o)}>({Per(pr, o)})</span>
                    </td>
                </>
                : <td>
                    <span className={`fa fa-chevron-${od == 1 ? 'up red' : 'down blue'}`} />
                </td>
            }
            <td><span className='des'>{dt.parse(d, 'M월D일 HH:mm')}</span></td>
            <td><span className='des' ref={e => { ref.current[d] = e }}></span></td>
        </tr>;
    });
    // moreTable을 쓰면 useRef을 통해 만든 타이머가 끊김.
    return <div className={styles.box}>
        <div className={styles.queueTable}>
            {queueBody?.length
                ? <table>
                    <colgroup>
                        <col width={'20%'} />
                        <col width={'15%'} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>{by == 'stock' ? '종목' : '유저'}</th>
                            {/* <th><span className='mh'>예측</span>종류</th> */}
                            <th>예측</th>
                            <th><span className='mh'>예측</span>시간</th>
                            <th>채점<span className='mh'>시간</span></th>
                        </tr>
                    </thead>
                    <tbody>{queueBody}</tbody>
                </table>
                : <div>
                    <p>대기중인 예측이 없습니다.</p>
                    <p>지금 예측을 시작하고 랭크를 올려보세요.</p>
                </div>}
        </div>
    </div>
}

export function UserPredTable({ data, meta, }) {
    data?.sort(dt.lsort);
    var s = 1000;
    const dataBody = data?.map((e, i) => {
        const { t, code, d, o, pr, od, at, uid, p } = e;
        return <tr key={`pred${i}`}>
            <th className={styles.stock}>
                <Link href={`/stock/${meta[code]?.n}`}>
                    {meta[code]?.n}
                </Link>
            </th>
            <td>{t == 'od' ? '오떨' : '가격'}</td>
            {t == 'pr'
                ? <>
                    <td>
                        {Num(pr)}
                        <span className='mh'>&nbsp;</span><br className='ph' />
                        <span className={Color(pr, o)}>({Per(pr, o)})</span>
                    </td>
                </>
                : <td>
                    <span className={`fa fa-chevron-${od == 1 ? 'up red' : 'down blue'}`} />
                </td>
            }
            <td><span className='des'>{dt.parse(d, 'M월D일 HH:mm')}</span></td>
            <td className='des'>
                {NumFix(s += (i < 500 && p <= 0 ? 0 : p), 1)}
                <span className='mh'>&nbsp;</span><br className='ph' />
                <span className={Color(v)}>
                    ({i < 500 && p <= 0
                        ? <s>{Fix(p, 2)}</s>
                        : Fix(p, 2)
                    })
                </span>
            </td>
        </tr>;
    });
    const head = <tr>
        <th>종목</th>
        <th><span className='mh'>예측</span>종류</th>
        <th>예측</th>
        <th><span className='mh'>예측</span>시간</th>
        <th>점수</th>
    </tr>;
    return <div className={styles.box}>
        <div className={styles.dataTable}>
            {dataBody.length
                ? <MoreTable head={head} data={dataBody} start={10} step={10} />
                : <div>
                    <p>아직 채점된 예측이 없습니다.</p>
                    <p>지금 예측을 시작하고 랭크를 올려보세요.</p>
                </div>}
        </div>
    </div>
}
