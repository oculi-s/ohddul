import squarify from 'squarify'
import styles from '@/styles/Chart/Tree.module.scss'
import groupColors from '@/public/group/color';
import colors from '@/module/colors';
import Link from 'next/link';
import { Div } from '@/module/ba';
import '@/module/array';

const stockElement = ({
    meta, code, first, gname, total, price,
    x0, y0, x1, y1
}) => {
    const mkt = meta[code].a * price[code].c;
    const t = mkt / total;
    const k = mkt / (meta[first].a * price[first].c);
    const inner = mkt / total * 100 > 0.05;

    return <div
        key={code}
        className={styles.stock}
        style={{
            left: `${x0}%`,
            top: `${y0}%`,
            width: `${x1 - x0}%`,
            height: `${y1 - y0}%`,
            backgroundColor: groupColors[gname] || colors[0],
            filter: `brightness(${Math.pow(k, .05)})`,
            fontSize: `${Math.pow(t, .3) * 60}px`
        }}
    >
        {inner && <div className={styles.info}>
            <Link href={`/stock/${code}`}>{meta[code].n}</Link>
            <p className={styles.percent}>({Div(mkt, total, 1)})</p>
        </div>}
    </div>
}

const Treemap = ({ group, meta, price }) => {
    meta = meta?.data;
    const all = price;
    const data = Object.values(group.data)
        ?.sort((b, a) => a.price - b.price)
        ?.slice(0, 20)
        ?.map(({ name, price, child }) => {
            child = child
                ?.filter(e => meta[e].a && all[e].c)
                ?.sort((b, a) => meta[a].a * all[a].c - meta[b].a * all[b].c);
            return {
                name,
                value: price,
                children: child
                    ?.map(code => ({
                        code,
                        first: child[0],
                        gname: name,
                        value: meta[code].a * all[code].c
                    })),
            }
        })

    const total = Object.keys(meta)
        ?.filter(e => meta[e]?.a && price[e]?.c)
        ?.map(e => meta[e]?.a * price[e]?.c).sum();

    const box = { x0: 0, y0: 0, x1: 100, y1: 100 };
    const props = { group, meta, price, total };
    return (
        <div className={styles.wrap}>
            {squarify(data, box)?.map(node =>
                stockElement({ ...node, ...props }))
            }
        </div>
    );
};

export default Treemap;
