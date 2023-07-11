import styles from '$/Base/Pagination.module.scss';
import Link from 'next/link';

export default function Pagination({ data, p, N, T }) {
    const M = parseInt((T + N) / N);

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
                {p > 1 ? <Link href={{ query: { p: p - 1 } }}>
                    <span className='fa fa-chevron-left'></span> 이전
                </Link> : ''}
            </span>
            <div className={styles.pages}>
                {pages}
            </div>
            <span className={styles.next}>
                {p < M ? <Link href={{ query: { p: p + 1 } }}>
                    다음 <span className='fa fa-chevron-right'></span>
                </Link> : ''}
            </span>

        </div>
    </div>
}