import '@/module/array';
import styles from '@/styles/Index.module.scss';
import ToggleTab from '@/component/base/tab';
import { Price } from '@/module/ba';
import Link from 'next/link';
import { useState } from 'react';
import GroupDoughnutChart from '@/component/chart/GroupDoughnut';
import groupImg from "@/public/group/Default";
import Image from 'next/image';

const GroupMeta = ({ name, group, price, meta }) => {
    meta = meta?.data;
    group = group[name];
    const equityTotal = group?.sum;
    const groupPrice = group?.child
        ?.map(e => { return { code: e, price: meta[e]?.amount * price[e]?.close } })
        ?.sort((b, a) => a.price - b.price);
    const priceSum = groupPrice.map(e => e.price).sum();
    const first = groupPrice[0];
    return <div className={styles.meta}>
        <table>
            <tbody>
                <tr><th colSpan={2}>
                    <Image
                        alt={`${name}그룹 로고`}
                        src={groupImg[name]}
                    />
                    <Link href={`/group/${name}`}>{name}그룹</Link>
                </th></tr>
                <tr><th>자산총액</th><td>{Price(10 * equityTotal)}</td></tr>
                <tr><th>시가총액</th><td>{Price(priceSum)}</td></tr>
                <tr><th>종목 수</th><td>{group?.child?.length}</td></tr>
                <tr>
                    <th>대장주</th>
                    <td>
                        <Link href={`/stock/${first?.code}`}>
                            {meta[first?.code]?.name}
                        </Link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
}

/**
 * sort by는 0일 때 자산, 1일 때 시총으로
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
            <GroupMeta {...{ name, group, price, meta }} />
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

export default GroupBubble;