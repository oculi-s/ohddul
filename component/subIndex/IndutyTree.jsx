import TotalIndutyTree from '#/chart/TotalIndutyTreeMap';
import styles from '@/styles/Index.module.scss';
const Induty = ({ price, meta, induty, index }) => {
    return <div className={styles.area}>
        <h3>오늘의 업종</h3>
        <TotalIndutyTree {...{ price, meta, induty, index }} />
    </div>;
}

export default Induty;