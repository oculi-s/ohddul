import GroupTreeMap from '#/chart/GroupTreeMap';
import styles from '$/Group/Group.module.scss';

function PriceElement(props) {
    return <>
        <h3>그룹사 주가 요약정보</h3>
        <div className={styles.groupChart}>
            <GroupTreeMap {...props} />
        </div>
    </>;
}

export default PriceElement;