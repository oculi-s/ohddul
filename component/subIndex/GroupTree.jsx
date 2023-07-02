import styles from '@/styles/Index.module.scss';
import TotalGroupTree from '#/chart/TotalGroupTreeMap';

export default function GroupTree(props) {
    return <div className={`${styles.area} ${styles.groupArea}`}>
        <h3>오늘의 시가총액</h3>
        <div className={styles.chart}>
            <TotalGroupTree {...props} />
        </div>
        <p className='des'>클릭하시면 종목/그룹이 전환됩니다.</p>
    </div>
}
