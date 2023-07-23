import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loading } from "#/base/base";
import { Div } from "@/module/ba";
import '@/module/array';
import scss from '$/variables.module.scss';
import styles from '$/Chart/Flow.module.scss';
import Icon from "@/public/icon";
import { SubGraph } from "./groupShareMeta";

var cnt = 0;
const Mermaid = ({ chart }) => {
    mermaid.initialize({
        startOnLoad: true,
        theme: "default",
        flowchart: {
            arrowMarkerAbsolute: true,
            useMaxWidth: true,
            htmlLabels: true,
            defaultRenderer: "elk",
            curve: 'step',
        },
    });
    const ref = useRef(null);
    const [chartLoad, setChartLoad] = useState(true);
    const [data, setData] = useState('');

    useEffect(() => {
        if (ref.current && chartLoad) {
            mermaid.render(ref.current.id, chart).then(({ svg }) => {
                setData(svg);
                setChartLoad(false);
            });
        }
    }, [chart, ref?.current]);

    return (
        <div className="shareMermaid">
            <div ref={ref} id={`flow${cnt++}`} className="d">{chart}</div>
            {chartLoad
                ? <Loading left="auto" right="auto" />
                : <div dangerouslySetInnerHTML={{ __html: data }}></div>
            }
        </div>
    );
};

const GroupShareElement = ({ meta, share, group }) => {
    const ch = group?.ch?.map(e => meta.data[e]?.n);

    const labels = [];
    const nodes = {};
    const edges = [];
    let RATE = 1;
    if (group?.n == '카카오') RATE = 5;

    const make = name => name?.replace(/ /g, '-');
    share.forEach(([e, share]) => {
        const stockName = meta.data[e]?.n;
        let stock = make(stockName);
        let anchor = `<a href=/stock/${meta.data[e]?.n}>${meta.data[e]?.n}</a>`
        labels.push(stock);
        let sname = `${stock}(${anchor})`;
        nodes[stockName] = sname;

        share
            ?.filter(x => x.amount / meta.data[e]?.a * 100 > RATE)
            ?.forEach(x => {
                let holder = x.name;
                let amount = x.amount;
                if (holder === '소액주주' || holder === '국민연금') return;
                let link = ch.includes(holder) ? '-->' : '-.->'
                const code = meta.index[holder];
                const label = make(holder);
                labels.push(label);
                let anchor = code
                    ? `<a href=/stock/${holder}>${holder}</a>`
                    : holder;
                const cname = `${label}(${anchor})`;
                nodes[holder] = cname;
                edges.push(`${label} ${link} |${Div(amount, meta.data[e]?.a, 1)}| ${sname}`);
            });
    });
    let data = `
    graph TD;\n
    ${Object.values(nodes)?.unique()?.join(";\n")};\n
    ${edges?.join(";\n")};`;
    // \n${edges[c].join(';\n')}
    const sub = SubGraph[group?.n];
    if (sub) {
        const subs = Object.values(sub).flat();
        const other = Object.keys(nodes).filter(e => !subs.includes(e));
        data = `flowchart TD;\n
        ${other.map(e => nodes[e]).join(';\n')};
        ${Object.entries(sub).map(([k, v]) =>
            `subgraph ${k};\n
            direction LR;\n
            ${v.map(c => `${nodes[c]}`).join(';\n')};\n`
        ).join('end;\n')}end;\n
        ${edges?.join(";\n")};`;
    }

    // union find로 subgraph만들기
    const [fixed, setFixed] = useState(false);

    return (
        <div className={`${styles.wrap} ${fixed ? styles.fixed : ''}`}>
            {/* {share.map(e => e[1]).flat().map(e => Name(e.name)).unique().map(e => `"${e}":""`).join(', ')} */}
            {/* <pre>{data}</pre> */}
            <h3>출자구조 요약</h3>
            <h3>출자지도</h3>
            <div className={styles.chart}>
                <Mermaid chart={data} />
            </div>
            <i onClick={e => { setFixed(!fixed); }}><Icon name='FullScreen' /></i>
        </div>
    );
};

export default GroupShareElement;
