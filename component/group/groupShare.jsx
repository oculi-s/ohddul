import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loading } from "#/base/base";
import Name from "@/data/NameDict";
import { Div } from "@/module/ba";
import '@/module/array';
import Link from "next/link";
import scss from '$/variables.module.scss';
import styles from '$/Chart/Flow.module.scss';
import Icon from "@/public/icon";

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
    const nodes = [];
    const edges = [];

    var i = 0;
    const make = name => name?.replace(/ /g, '-');
    share.forEach(([e, share]) => {
        const name = meta.data[e]?.n;
        let stock = make(name);
        let anchor = `<a href=/stock/${meta.data[e]?.n}>${meta.data[e]?.n}</a>`
        labels.push(stock);
        let cname = `${stock}(${anchor})`;
        nodes.push(cname);

        share
            ?.filter(x => x.amount / meta.data[e]?.a > 0.05)
            ?.forEach(x => {
                let name = x.name;
                let amount = x.amount;
                name = Name(name, stock);
                if (name === '소액주주' || name === '국민연금') return;
                let link = ch.includes(name) ? '-->' : '-.->'
                const code = meta.index[name];
                const label = make(name);
                labels.push(label);
                let anchor = code
                    ? `<a href=/stock/${name}>${name}</a>`
                    : name;
                const node = `${label}(${anchor})`;
                nodes.push(node);
                edges.push(`${label} ${link} |${Div(amount, meta.data[e]?.a, 1)}| ${cname}`);
            });
    });

    // union find로 subgraph만들기
    const data = `graph TD;\n${nodes.unique().join(";\n")};\n${edges.join(";\n")};`;
    const [fixed, setFixed] = useState(false);

    return (
        <div className={`${styles.wrap} ${fixed ? styles.fixed : ''}`}>
            {/* {share.map(e => e[1]).flat().map(e => Name(e.name)).unique().map(e => `"${e}":""`).join(', ')} */}
            <div className={styles.chart}>
                <Mermaid chart={data} />
            </div>
            <i onClick={e => { setFixed(!fixed); }}><Icon name='FullScreen' /></i>
        </div>
    );
};

export default GroupShareElement;
