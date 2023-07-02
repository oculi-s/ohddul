import squarify from 'squarify'
import styles from '@/styles/Chart/Tree.module.scss'
import colors from '@/module/colors';
import scss from '@/styles/variables.module.scss';
import Link from 'next/link';
import { Div, Int } from '@/module/ba';
import '@/module/array';
import { useEffect, useState } from 'react';

const stockElement = ({
    meta, code, first, name, total, index, value,
    x0, y0, x1, y1, i
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
            backgroundColor: colors[i],

            filter: `brightness(${Math.pow(k, .05)})`,
            fontSize: `${Math.pow(t, .3) * 40}px`
        }}
    >
        {inner && <div className={styles.info} onClick={e => { e.stopPropagation(); }}>
            {code ?
                <Link href={`/stock/${code}`}>{meta[code]?.n}</Link> :
                <Link href={`/induty/${name}`}>{index?.index[name]}</Link>
            }
            <p className={styles.percent}>({Div(value, total, 1)})</p>
        </div>}
    </div>
}

const refindData = ({ induty, index, meta, price, withStock, N }) => {
    const len = 3;
    const data = Object.keys(index?.index)
        ?.filter(e => e.length == len)
        ?.map(code => {
            // console.log(code);
            const child = Object.keys(induty)
                ?.filter(e => induty[e].slice(0, len - 1) == code.slice(1))
                ?.filter(e => meta[e]?.a && price[e]?.c)
            return {
                name: code, child,
                price: child?.map(e => meta[e]?.a * price[e]?.c).sum()
            }
        });
    console.log(data.find(e => e.child.includes('005930')))
    const all = price;
    return data
        ?.sort((b, a) => a.price - b.price)
        ?.slice(0, N)
        ?.map(({ name, price, child }, i) => {
            let children = undefined;
            if (withStock) {
                children = child
                    ?.filter(e => meta[e].a && all[e].c)
                    ?.sort((b, a) => meta[a].a * all[a].c - meta[b].a * all[b].c)
                    ?.slice(0, 20)
                children = children?.map(code => ({
                    code, name,
                    first: meta[children[0]].a * all[children[0]].c,
                    value: meta[code].a * all[code].c,
                    i
                }));
            }
            return { name, value: price, children, i }
        })
}

const TotalIndutyTree = ({ induty, index, meta, price }) => {
    meta = meta?.data;
    induty = induty?.data;
    const [withStock, setStock] = useState(true);
    const [data, setData] = useState([]);
    const [N, setN] = useState(10);

    useEffect(() => {
        console.log('treemap 차트 렌더링중')
        setData(refindData({ induty, index, meta, price, withStock, N }));
        if (window.innerWidth < Int(scss.mobWidth)) {
            setN(5);
        } else {
            setN(10);
        }
    }, [withStock, N])

    const total = Object.keys(meta)
        ?.filter(e => meta[e]?.a && price[e]?.c)
        ?.map(e => meta[e]?.a * price[e]?.c).sum();

    const box = { x0: 0, y0: 0, x1: 100, y1: 100 };
    const props = { index, meta, price, total };
    return (
        <>
            <div className={styles.wrap} onClick={e => setStock(c => !c)}>
                {squarify(data, box)?.map(node =>
                    stockElement({ ...node, ...props }))
                }
            </div>
        </>
    );
};

export default TotalIndutyTree;
