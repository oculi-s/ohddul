import styles from '@/styles/Index.module.scss';
import Treemap from '#/chart/GroupTreeMap';

export default function GroupTree(props) {
    return <div className={`${styles.area} ${styles.groupArea}`}>
        <h3>오늘의 시가총액</h3>
        <div className={styles.chart}>
            <Treemap {...props} />
        </div>
    </div>
}
