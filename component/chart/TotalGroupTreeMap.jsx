import squarify from 'squarify'
import styles from '$/Chart/Tree.module.scss'
import groupColors from '@/public/group/color';
import colors from '@/module/colors';
import scss from '$/variables.module.scss';
import Link from 'next/link';
import { Div, Int } from '@/module/ba';
import '@/module/array';
import { useEffect, useState } from 'react';

const stockElement = ({
    meta, code, first, name, total, price, value,
    x0, y0, x1, y1
}) => {
    const t = value / total;
    const k = value / first;
    const inner = value / total * 100 > 0.05;

    return <div
        key={code || name}
        className={styles.stock}
        style={{
            left: `${x0}%`,
            top: `${y0}%`,
            width: `${x1 - x0}%`,
            height: `${y1 - y0}%`,
            backgroundColor: groupColors[name] || colors[0],

            filter: `brightness(${.8 * Math.pow(k, .05)})`,
            fontSize: `${Math.pow(t, .3) * 60}px`
        }}
    >
        {inner && <div className={styles.info} onClick={e => { e.stopPropagation(); }}>
            {code ?
                <Link href={`/stock/${code}`}>{meta[code]?.n}</Link> :
                <Link href={`/group/${name}`}>{name}</Link>
            }
            <p className={styles.percent}>({Div(value, total, 1)})</p>
        </div>}
    </div>
}

const refindData = ({ group, meta, price, withStock, N }) => {
    const all = price;
    return Object.values(group.data)
        ?.sort((b, a) => a.price - b.price)
        ?.slice(0, N)
        ?.map(({ name, price, child }) => {
            let children = undefined;
            if (withStock) {
                children = child
                    ?.filter(e => meta[e].a && all[e].c)
                    ?.sort((b, a) => meta[a].a * all[a].c - meta[b].a * all[b].c);
                children = children?.map(code => ({
                    code, name,
                    first: meta[children[0]].a * all[children[0]].c,
                    value: meta[code].a * all[code].c
                }));
            }
            return { name, value: price, children }
        })
}

const TotalGroupTree = ({ group, meta, price }) => {
    meta = meta?.data;
    const [withStock, setStock] = useState(true);
    const [data, setData] = useState([]);
    const [N, setN] = useState(20);
    useEffect(() => {
        console.log('treemap 차트 렌더링중')
        setData(refindData({ group, meta, price, withStock, N }));
        if (window.innerWidth < Int(scss.mobWidth)) {
            setN(8);
        } else {
            setN(20);
        }
    }, [withStock, N])

    const total = Object.keys(meta)
        ?.filter(e => meta[e]?.a && price[e]?.c)
        ?.map(e => meta[e]?.a * price[e]?.c).sum();

    const box = { x0: 0, y0: 0, x1: 100, y1: 100 };
    const props = { group, meta, price, total };
    return (
        <>
            {/* <CheckBox defaultChecked={withStock} onChange={setStock} name={'종목별'} /> */}
            <div className={styles.wrap} onClick={e => setStock(c => !c)}>
                {squarify(data, box)?.map(node =>
                    stockElement({ ...node, ...props }))
                }
            </div>
        </>
    );
};

export default TotalGroupTree;
