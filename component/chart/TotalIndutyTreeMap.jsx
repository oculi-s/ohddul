import squarify from 'squarify';
import styles from '$/Chart/Tree.module.scss'
import colors from '@/module/colors';
import scss from '$/variables.module.scss';
import Link from 'next/link';
import { H2R, Int, parseFix } from '@/module/ba';
import '@/module/array';
import { useEffect, useState } from 'react';
import Icon from '@/public/icon';

function stockElement(index, {
    x0, y0, x1, y1, c, g, n, value: v
}, i) {
    if (!index) return;
    const gn = index[g];
    const inner = v > 0.5;

    return <div
        key={i}
        className={styles.stock}
        style={{
            left: `${x0}%`,
            top: `${y0}%`,
            width: `${x1 - x0}%`,
            height: `${y1 - y0}%`,
            backgroundColor: H2R(colors[g], .8),
        }}
    >
        <div className={styles.inner}>
            {inner && <div className={styles.info} onClick={e => { e.stopPropagation(); }}>
                {n ?
                    <Link href={`/stock/${n}`}>{n}</Link> :
                    <Link href={`/induty/${c}`}>{gn}</Link>}
                <p className={styles.percent}>({parseFix(v / 10, 1)}%)</p>
            </div>}
        </div>
    </div>;
}

const TotalIndutyTree = ({ tree }) => {
    const [stock, setStock] = useState(0);
    const [data, setData] = useState([]);
    const [N, setN] = useState(20);
    const [fixed, setFixed] = useState(false);

    useEffect(() => {
        setData(tree?.induty?.slice(0, N)?.map(e => {
            const t = { ...e };
            if (!stock) delete t.children;
            return t;
        }));
        if (window.innerWidth < Int(scss.mobWidth)) {
            setN(8);
        } else {
            setN(20);
        }
    }, [stock, N]);

    const box = { x0: 0, y0: 0, x1: 100, y1: 100 };
    const index = tree?.index?.induty;
    return (
        <>
            <div
                className={`${styles.wrap} ${fixed ? styles.fixed : ''}`}
                onClick={e => setStock(c => 1 - c)}
            >
                {squarify(data, box)?.map((e, i) => stockElement(index, e, i))}
                <i onClick={e => { e.preventDefault(); setFixed(!fixed); e.stopPropagation(); }}><Icon name='FullScreen' /></i>
            </div>
        </>
    );
};

export default TotalIndutyTree;
