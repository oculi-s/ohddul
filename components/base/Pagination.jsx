import styles from '$/Base/Pagination.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Pagination({ data, p, N, T }) {
    const M = parseInt(T / N);

    const pages = Array.from(Array(5).keys())
        ?.map(e => e + p - 2)
        ?.map(i => {
            return <span
                key={i}
                className={`${styles.page} ${p == i ? styles.active : ''}`}
            >
                {i > 0 && i <= M
                    ? <Link href={{ query: { p: i } }}>{i}</Link>
                    : ''
                }
            </span>
        })

    return <div className={styles.wrap}>
        <div className={styles.head}>
            <span>{(p - 1) * N + 1}~{p * N} / {T}개</span>
        </div>
        <div className={styles.body}>
            {data}
        </div>
        <div className={styles.footer}>
            <span className={styles.prev}>
                <Link href={{ query: { p: 1 } }}>
                    <span className='fa fa-angle-double-left'></span> 처음
                </Link>
                {p > 1 ? <Link href={{ query: { p: p - 1 } }}>
                    <span className='fa fa-angle-left'></span> 이전
                </Link> : ''}
            </span>
            <div className={styles.pages}>
                {pages}
            </div>
            <span className={styles.next}>
                {p < M ? <Link href={{ query: { p: p + 1 } }}>
                    다음 <span className='fa fa-angle-right'></span>
                </Link> : ''}
                <Link href={{ query: { p: M } }}>
                    끝 <span className='fa fa-angle-double-right'></span>
                </Link>
            </span>

        </div>
    </div>
}

export function MoreTable({ head, data, foot, step = 5, start = 5 }) {
    const T = data?.length;
    const [N, setN] = useState(start);
    const [view, setView] = useState(start < T);
    useEffect(() => {
        setN(start);
        setView(start < T);
    }, [head])

    return <table className={styles.moreTable}>
        <thead>{head}</thead>
        <tbody>
            {data?.slice(0, N)}
        </tbody>
        <tfoot>
            {view && <tr onClick={() => {
                setN(N + step);
                if (N + step >= T) { setView(false); }
            }} className={styles.more}>
                <th colSpan={6}>더보기</th>
            </tr>}
            {foot}
        </tfoot>
    </table>
}