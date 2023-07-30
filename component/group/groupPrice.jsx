import Help from '#/base/Help';
import GroupTreeMap from '#/chart/GroupTreeMap';
import PriceLine from '#/chart/TradeChart';
import styles from '$/Group/Group.module.scss';
import { priceHelp } from './HelpDescription';

function GroupPriceElement({
    group, meta, price,
    groupPrice, load
}) {
    console.log(groupPrice[0]);
    return <>
        <h3>시가총액 차트</h3>
        <div className={styles.priceChart}>
            <PriceLine price={groupPrice} addEarn={false} isGroup={true} />
        </div>
        <h3>구성 비율</h3>
        <div className={styles.groupChart}>
            <GroupTreeMap group={group} meta={meta} price={price} />
        </div>
    </>;
}

export default GroupPriceElement;