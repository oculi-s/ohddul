import Help from '#/base/Help';
import GroupTreeMap from '#/chart/GroupTreeMap';
import PriceLine from '#/chart/PriceLine';
import styles from '$/Group/Group.module.scss';
import { priceHelp } from './HelpDescription';

function GroupPriceElement({
    group, meta, price,
    groupPrice, load
}) {
    const prices = [groupPrice];
    return <>
        <h3>수정주가 차트<Help {...priceHelp} /></h3>
        <div className={styles.priceChart}>
            <PriceLine prices={prices} load={load} />
        </div>
        <h3>구성 비율</h3>
        <div className={styles.groupChart}>
            <GroupTreeMap group={group} meta={meta} price={price} />
        </div>
    </>;
}

export default GroupPriceElement;