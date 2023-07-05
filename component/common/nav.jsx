import styles from '$/Common/Nav.module.scss'
import Link from 'next/link';

export default function Nav({ mobAside, setAsideShow }) {
    return <nav className={styles.nav}>
        <div className={styles.buttonList}>
            <div className={styles.button}><Link href="/">Home</Link></div>
            <div className={styles.button}><Link href="/help">도움말</Link></div>
            <div className={styles.button}><Link href="/idea">의견게시판</Link></div>
        </div>
        <button
            className={`${styles.menuOpen} fa fa-bars`}
            onClick={e => { setAsideShow(!mobAside) }}
        >
        </button>
    </nav >
}