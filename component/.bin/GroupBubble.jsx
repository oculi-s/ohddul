import '@/module/array';
import styles from '@/styles/Index.module.scss';
import ToggleTab from '#/base/ToggleTab';
import { useState } from 'react';
import GroupDoughnutChart from '#/chart/GroupDoughnut';

/**
 * sort by는 0일 때 자산, 1일 때 시총으로
 * 
 * 2023.06.26 2layer piechart로 변경하면서 폐기
 */
const N = 8;
const sortKeys = ['시가총액순', '자산순']
const GroupBubble = ({ group = {}, price, meta }) => {
    const [sortBy, setSortBy] = useState(0);
    const sortFunction = [(b, a) => {
        const sa = group[a]?.child?.map(e => price[e]?.close * meta.data[e]?.amount).sum();
        const sb = group[b]?.child?.map(e => price[e]?.close * meta.data[e]?.amount).sum();
        return sa - sb;
    }, (a, b) => group[a].rank - group[b].rank]
    const names = Object.keys(group)
        .sort(sortFunction[sortBy])
        .slice(0, N);

    const datas = names.map(name => {
        return <div key={name}>
            <div className={styles.chart}>
                <GroupDoughnutChart {...{ name, group, price, meta }} />
            </div>
        </div>;
    })
    return <div className={`${styles.area} ${styles.groupArea}`}>
        <h3>대한민국 대기업 순위
            <button onClick={e => setSortBy(1 - sortBy)}>{sortKeys[sortBy]}</button>
        </h3>
        {ToggleTab({ names, datas })}
    </div>
}
