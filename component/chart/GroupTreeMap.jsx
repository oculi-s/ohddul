import squarify from 'squarify'
import styles from '@/styles/Chart/Tree.module.scss'
import groupColors from '@/public/group/color';
import colors from '@/module/colors';
import Link from 'next/link';
import { Div, Price } from '@/module/ba';
import '@/module/array';
import { useEffect, useState } from 'react';

const stockElement = ({
    meta, code, first, name, total, value,
    x0, y0, x1, y1
}) => {
    const t = value / total;
    const k = value / first;
    const inner = value / total * 100 > 0.05;

    return <div
        key={code}
        className={styles.stock}
        style={{
            left: `${x0}%`,
            top: `${y0}%`,
            width: `${x1 - x0}%`,
            height: `${y1 - y0}%`,
            backgroundColor: groupColors[name] || colors[0],

            filter: `brightness(${Math.pow(k, .05)})`,
            fontSize: `${Math.pow(t, .3) * 60}px`
        }}
    >
        {inner && <div className={styles.info}>
            <Link href={`/stock/${code}`}>{meta[code]?.n}</Link>
            <p className={styles.percent}>({Price(value)}, {Div(value, total, 1)})</p>
        </div>}
    </div>
}

const refindData = ({ group, meta, price }) => {
    const { name, child } = group;
    let children = child
        ?.filter(e => meta[e].a && price[e].c)
        ?.sort((b, a) => meta[a].a * price[a].c - meta[b].a * price[b].c);
    children = children?.map(code => ({
        code, name,
        first: meta[children[0]].a * price[children[0]].c,
        value: meta[code].a * price[code].c
    }));
    return children;
}

const GroupTreeMap = ({ group, meta, price }) => {
    if (!group?.price) return;
    meta = meta?.data;
    const [data, setData] = useState([]);
    useEffect(() => {
        setData(refindData({ group, meta, price }));
    }, [])
    const total = group.price;
    const box = { x0: 0, y0: 0, x1: 100, y1: 100 };
    const props = { group, meta, price, total };
    return (
        <>
            <div className={styles.wrap}>
                {squarify(data, box)?.map(node =>
                    stockElement({ ...node, ...props }))
                }
            </div>
        </>
    );
};

export default GroupTreeMap;
