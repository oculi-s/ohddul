import squarify from 'squarify'
import styles from '$/Chart/Tree.module.scss'
import groupColors from '@/public/group/color';
import colors from '@/module/colors';
import scss from '$/variables.module.scss';
import Link from 'next/link';
import { Div, H2R, Price } from '@/module/ba';
import '@/module/array';
import { useEffect, useState } from 'react';
import '@/module/array';

function stockElement({
    meta, code, first, n, total, value,
    x0, y0, x1, y1
}) {
    const k = value / first;
    const inner = value / total * 100 > 0.05;
    const br = Math.pow(k, .05);
    const color = H2R(groupColors[n] || colors[0], br);
    const style = {
        left: `${x0}%`,
        top: `${y0}%`,
        width: `${x1 - x0}%`,
        height: `${y1 - y0}%`,
        backgroundColor: color,
    };
    return <div
        key={code}
        className={`${styles.stock} ${styles[n]}`}
        style={style}
    >
        <div className={styles.inner}>
            {inner && <div className={styles.info}>
                <Link href={`/stock/${code}`}>{meta[code]?.n}</Link>
                <p className={styles.percent}>({Price(value)}, {Div(value, total, 1)})</p>
            </div>}
        </div>
    </div>;
}

const refindData = ({ group, meta, price }) => {
    const { n, ch } = group;
    let children = ch
        ?.filter(e => meta[e]?.a && price[e]?.c)
        ?.qsort((b, a) => meta[a].a * price[a].c - meta[b].a * price[b].c);
    children = children?.map(code => ({
        code, n,
        first: meta[children[0]].a * price[children[0]].c,
        value: meta[code].a * price[code].c
    }));
    return children;
}

function GroupTreeMap({ group, meta, price }) {
    if (!group?.p) return;
    meta = meta?.data || meta;
    const [data, setData] = useState([]);
    useEffect(() => {
        setData(refindData({ group, meta, price }));
    }, [group]);
    const total = group.p;
    const box = { x0: 0, y0: 0, x1: 100, y1: 100 };
    const props = { group, meta, price, total };
    return <div className={styles.wrap}>
        {squarify(data, box)?.map(node =>
            stockElement({ ...node, ...props }))
        }
    </div>;
}

export default GroupTreeMap;
