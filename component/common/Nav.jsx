import styles from '$/Common/Nav.module.scss'
import Link from 'next/link';
import Search from '#/common/Search';
import { useState } from 'react';
import Image from 'next/image';
import { Alarms } from '#/User';

export default function Nav(props) {
    const [view, setView] = useState(false);
    const setAsideShow = props?.setAsideShow;
    return <nav className={styles.nav}>
        <div className={styles.inner}>
            <div className={styles.buttonList}>
                <Link href="/" className={styles.home}>
                    <Image src='/android-chrome-512x512.png'
                        width={'32'}
                        height={'32'}
                        alt='오떨 로고'
                    />
                </Link>
                <div className={styles.button}><Link href="/help">도움말</Link></div>
                <div className={styles.button}><Link href="/idea">의견게시판</Link></div>
            </div>
            <div className={styles.buttonList2} >
                <button
                    className={`fa fa-bars ph`}
                    onClick={e => { setAsideShow(c => !c) }}
                />
            </div>
            <Search {...{ ...props, view, setView }} />
        </div>
    </nav >
}