import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loading } from "#/base/base";
import { Div, Fix, Price, parseFix } from "@/module/ba";
import '@/module/array';
import scss from '$/variables.module.scss';
import styles from '$/Chart/Flow.module.scss';
import Icon from "@/public/icon";
import { SubGraph } from "./groupShareMeta";

var cnt = 0;
mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    flowchart: {
        arrowMarkerAbsolute: true,
        useMaxWidth: true,
        useWidth: true,
        htmlLabels: true,
        defaultRenderer: "elk",
        curve: 'stepAfter',
    },
});
const GroupShareFlow = ({ chart }) => {
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


const GroupShareElement = ({ meta, share, group }) => {
    const ch = group?.ch?.map(e => meta.data[e]?.n);
    const [fixed, setFixed] = useState(false);
    const edges = [], classes = [], styless = [];
    const ids = {}, labels = {}, rev = {};
    const RATE = 1;

    const sub = SubGraph[group?.n];
    const subs = Object.values(sub || {})?.flat();
    const subDict = sub ? Object.fromEntries(Object.entries(sub)
        ?.map(([k, v]) => {
            if (v.constructor == Array)
                return v.map(e => [e, k])
            else return Object.values(v).flat().map(e => [e, k]);
        })?.flat()) : {};

    const shareData = share
        ?.filter(e => e.r >= RATE)
        ?.filter(e => e.n != '소액주주' && e.n != '국민연금');
    [...ch, ...shareData].unique().forEach((x, i) => {
        const n = x.n || x;
        ids[n] = `ch${i}`, rev[ids[n]] = n;
        const code = meta.index[n];
        let className = subDict[n] || 'other';
        if (ch.includes(n)) className = 'stock';
        if (code) {
            labels[n] = `<a href="/stock/${n}">${n}</a>${x.r ? `<br>${x.r}%` : ''}`;
        } else {
            labels[n] = `${n}<br>${x.r}%`;
        }
        classes.push(`class ${ids[n]} ${className}`);
    })
    console.log(rev, ids)
    shareData
        ?.forEach((x, i) => {
            edges?.push(...x.ch
                ?.filter(e => e.r >= RATE)
                ?.map(c => {
                    const n = meta.data[c.code]?.n;
                    return { from: ids[x.n], to: ids[n], r: c.r, p: c.p };
                }))
        });
    let data = `
        flowchart LR
        classDef 오너일가 fill:${scss.bgBrighter},color:${scss.textBright};
        classDef other fill:${scss.bgMidDark},color:${scss.textDark},font-size:.9em;
        `
    if (sub) {
        const filtersub = sub => {
            if (sub.constructor == Array)
                return sub.filter(e => ids[e]);
            return Object.values(sub).map(e => filtersub(e)).flat();
        }
        const makesub = (key, sub, par) => {
            if (!sub) return '';
            if (sub?.constructor == Array) {
                sub = sub?.filter(e => ids[e]);
                if (!sub?.length) return '';
                let per = '';
                if (key == '오너일가' || par == '오너일가')
                    per = `<br>${parseFix(share.filter(x => sub.find(e => e == x.n))?.map(e => e.r)?.sum())}%`
                return `
                ${key ? `subgraph ${key}${per}
                direction TB`: ''}
                ${sub.map(c => `${ids[c]}(${labels[c]})`).join('\n')}
                ${key ? 'end' : ''}`;
            }
            return `
            subgraph ${key}
            direction TB
            ${makesub(null, sub?._)}
            ${Object.entries(sub)
                    ?.filter(([k, v]) => k != '_')
                    ?.map(([k, v]) => makesub(k, v, key)).join('\n')}
            end`;

        }
        const other = Object.keys(ids).filter(e => !subs.includes(e));
        data = `${data}
        ${other.map(c => `${ids[c]}(${labels[c]})`).join('\n')}
        ${Object.entries(sub)?.map(([k, v]) => {
            if (!filtersub(v).flat().length) return false;
            return makesub(k, v);
        })?.filter(e => e).join('')}
        ${edges?.map(({ from, to, r, p }) =>
            `${from} --> |${r}%<p class=d>${rev[from]}-${rev[to]} ${Price(p)}</p>| ${to}`
            // `${from} --> |${r}%| ${to}`
        )?.join("\n")}
        ${classes?.join('\n')}
        ${styless?.join('\n')}
        `;

    } else {
        data = `${data}
        ${Object.keys(ids)?.map(e => `${ids[e]}(${labels[e]})`)
                ?.unique()?.join("\n")}\n
        ${edges?.map(({ from, to, r, p }) =>
                    `${from} --> |${r}%<p class=d>${rev[from]}-${rev[to]} ${Price(p)}</p>| ${to}`
                )?.join("\n")}`;
    }
    data = data.split('\n').map(e => e.trim()).filter(e => e.length).join("\n");
    console.log(data);
    const owner = share.filter(e => subDict[e.n] == '오너일가' || subDict[e.n] == '재단')
        ?.map(e => e.p).sum();
    const ant = share.find(e => e.n == '소액주주');
    const child = ch?.map(n => share.find(x => x.n == n)?.p || 0).sum();
    const gov = share.filter(e => e.n == '국민연금' || e.n == '산업은행')?.map(e => e.p)?.sum();

    return (
        <div className={`${styles.wrap} `}>
            <h3>지배력 요약</h3>
            <table className="fixed">
                <thead>
                    <tr>
                        <th>오너일가<span className="mh">/재단</span></th>
                        <th>소액주주</th>
                        <th>연기금</th>
                        <th>상호출자</th>
                    </tr>
                </thead>
                <tbody>
                    <tr align='center'>
                        <td>{Div(owner, group?.p, 1)}</td>
                        <td>{Div(ant?.p, group?.p, 1)}</td>
                        <td>{Div(gov, group?.p, 1)}</td>
                        <td>{Div(child, group?.p, 1)}</td>
                    </tr>
                </tbody>
            </table>
            <h3>출자지도</h3>
            <div className={`${styles.chart} ${fixed ? styles.fixed : ''} `}>
                <GroupShareFlow chart={data} />
                <i onClick={e => { setFixed(!fixed); }}><Icon name='FullScreen' /></i>
            </div>
            <p className="des">* 그룹에 대한 지배력이 1%이상인 주주만 표시됩니다.</p>
        </div>
    );
};

export default GroupShareElement;
