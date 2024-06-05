import styles from '$/Group/Group.module.scss';
import GroupTreeMap from '@/components/chart/GroupTreeMap';
import PriceLine from '@/components/chart/TradeChart';

function GroupPriceElement({
    group, meta, price,
    groupPrice, load, setLoad
}) {
    return <>
        <h3>시가총액 차트</h3>
        <div className={styles.priceChart}>
            <PriceLine price={groupPrice} addEarn={false} isGroup={true} load={load} setLoad={setLoad} />
        </div>
        <h3>구성 비율</h3>
        <div className={styles.groupChart}>
            <GroupTreeMap group={group} meta={meta} price={price} />
        </div>
    </>;
}

export default GroupPriceElement;