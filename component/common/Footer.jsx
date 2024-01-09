import styles from '$/Common/Footer.module.scss';
import Icon from '@/public/icon';
import Link from 'next/link';

export default function Footer() {
    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.inner}>
                    <div>V2.0 by oculis</div>
                    <div>
                        <Link href='https://oculis.tistory.com/notice/197' style={{ height: 25, width: 25, display: 'inline-block' }}>
                            <Icon name="Tistory"></Icon>
                        </Link>
                        <Link href="https://github.com/oculi-s" style={{ height: 25, width: 25, display: 'inline-block' }}>
                            <Icon name="Github"></Icon>
                        </Link>
                    </div>
                </div>
            </footer>
        </>
    )
}