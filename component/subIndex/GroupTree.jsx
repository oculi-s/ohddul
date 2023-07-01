import styles from '@/styles/Index.module.scss';
import Treemap from '#/chart/ApexChart';

export default function GroupTree(props) {
    return <div className={`${styles.area} ${styles.groupArea}`}>
        <h3>오늘의 시가총액</h3>
        <div className={styles.chart}>
            <Treemap {...props} />
        </div>
        <p className='des'>종목 이름을 클릭하면 종목정보로, 그룹 이름을 클릭하면 그룹정보로 이동합니다.</p>
    </div>
}
