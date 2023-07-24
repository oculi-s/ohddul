import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loading } from "#/base/base";
import { Div, Fix, parseFix } from "@/module/ba";
import '@/module/array';
import scss from '$/variables.module.scss';
import styles from '$/Chart/Flow.module.scss';
import Icon from "@/public/icon";
import { SubGraph } from "./groupShareMeta";
import { GroupBg, GroupText } from "@/public/group/color";

var cnt = 0;
mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    flowchart: {
        arrowMarkerAbsolute: true,
        useMaxWidth: true,
        htmlLabels: true,
        defaultRenderer: "elk",
        curve: 'stepAfter',
    },
});
const Mermaid = ({ chart }) => {
    const ref = useRef(null);
    const [chartLoad, setChartLoad] = useState(true);
    const [data, setData] = useState('');

    useEffect(() => {
        setChartLoad(true);
        if (ref.current) {
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

const GroupShareElement = ({ meta, price, share, group }) => {
    const ch = group?.ch?.map(e => meta.data[e]?.n);

    const [fixed, setFixed] = useState(false);
    const [chartLoad, setChartLoad] = useState(true);
    const edges = [], classes = [], styless = [];
    const ids = {}, labels = {}, rates = {};
    let RATE = 1;
    // if (group?.n == '카카오') RATE = 5;
    const sub = SubGraph[group?.n];
    const subs = Object.values(sub || {})?.flat();
    const subDict = Object.fromEntries(Object.entries(sub || {})?.map(([a, b]) => b.map(e => [e, a]))?.flat());


    const total = group?.p;
    const make = name => name?.replace(/ /g, '-');
    share.forEach(([e, share]) => {
        const stockName = meta.data[e]?.n;
        const stockId = make(stockName);
        const p = parseFix(meta.data[e]?.a * price[e]?.c * 100 / total);
        const stockLabel = `
            <a href="/stock/${stockName}">${stockName}</a>
        `.replace(/\n/g, '').trim();
        ids[stockName] = stockId;
        labels[stockName] = stockLabel;
        classes.push(`class ${stockId} stock`);

        share
            ?.filter(x =>
                // subs?.includes(x.name)
                // || ch?.includes(x.name)
                // || x.name?.includes(group?.n)
                true
            )
            ?.filter(x => x.amount / meta.data[e]?.a * 100 > RATE)
            ?.forEach(x => {
                const holderName = x.name;
                const a = x.amount;
                if (holderName === '소액주주' || holderName === '국민연금') return;
                const arrow = ch.includes(holderName) ? '-->' : '-.->'
                const code = meta.index[holderName];
                const holderId = make(holderName);
                const holderLabel = code
                    ? `<a href="/stock/${holderName}">${holderName}</a>`
                    : holderName;
                const holderClass = ch.includes(holderName)
                    ? 'stock'
                    : !subs.includes(holderName)
                        ? 'other'
                        : subDict[holderName] || 'auto';
                // 순환출자 때문에 사이클이 생기므로 지분율은 직접소유만 이용해 구함
                if (!rates[holderName]) rates[holderName] = 0;
                rates[holderName] += a * price[e]?.c;

                ids[holderName] = holderId;
                labels[holderName] = holderLabel;
                classes.push(`class ${holderId} ${holderClass}`);
                edges.push(`${holderId} ${arrow} |${Div(a, meta.data[e]?.a, 1)}| ${stockId}`);
            });
    });

    let data = `
        flowchart TD
        classDef 오너일가 fill:${scss.bgBrighter},color:${scss.textBright};
        classDef other fill:${scss.bgMidDark},color:${scss.textDark},font-size:.9em;
        `
    if (sub) {
        const other = Object.keys(ids).filter(e => !subs.includes(e));
        data = `${data}
        ${other.map(e => `${ids[e]}(${labels[e]})`).join('\n')};
        ${Object.entries(sub).map(([k, v]) => {
            return `subgraph ${k}
            direction LR
            ${v.map(c => {
                const r = rates[c] ? `<br><span class=des>${Div(rates[c], total)}</span>` : '';
                return `${ids[c]}(${labels[c]}${r})`
            }).join('\n')}\n`
        }).join('end\n')}end
        ${edges?.join("\n")}
        ${classes?.join('\n')}
        ${styless?.join('\n')}
        `;
        console.log(data);
    }
    else {
        data = `${data}
            ${Object.keys(ids)?.map(e => `${ids[e]}(${labels[e]})`)
                ?.unique()?.join("\n")}\n
            ${edges?.join("\n")}`;
    }
    // union find로 subgraph만들기

    {/* {share.map(e => e[1]).flat().map(e => Name(e.name)).unique().map(e => `"${e}":""`).join(', ')} */ }
    {/* <pre>{data}</pre> */ }
    return (
        <div className={`${styles.wrap}`}>
            <h3>출자구조 요약</h3>
            {/* <pre>{data}</pre> */}
            <h3>출자지도</h3>
            <div className={`${styles.chart} ${fixed ? styles.fixed : ''}`}>
                <Mermaid chart={data} />
                <i onClick={e => { setFixed(!fixed); }}><Icon name='FullScreen' /></i>
            </div>
        </div>
    );
};

export default GroupShareElement;
