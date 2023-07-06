import styles from '$/Common/Nav.module.scss'
import Link from 'next/link';
import Search from '#/common/search';
import { useState } from 'react';

export default function Nav(props) {
    const [view, setView] = useState(false);
    const setAsideShow = props?.setAsideShow;
    return <nav className={styles.nav}>
        <div className={styles.inner}>
            <div className={styles.buttonList}>
                <div className={styles.button}><Link href="/">Home</Link></div>
                <div className={styles.button}><Link href="/help">도움말</Link></div>
                <div className={styles.button}><Link href="/idea">의견게시판</Link></div>
            </div>
            <div className={styles.mobileBtn}>
                <button
                    className={`fa fa-bars`}
                    onClick={e => { setAsideShow(c => !c) }}
                />
            </div>
            <Search {...{ ...props, view, setView }} />
        </div>
    </nav >
}