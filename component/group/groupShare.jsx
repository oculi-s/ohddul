import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Loading } from "#/base/base";
import { Div } from "@/module/ba";
import '@/module/array';
import scss from '$/variables.module.scss';
import styles from '$/Chart/Flow.module.scss';
import Icon from "@/public/icon";
import Help from "#/base/Help";

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
const GroupShareFlow = ({ share, group }) => {
    const ref = useRef(null);
    const chartRef = useRef(null);
    const [chartLoad, setChartLoad] = useState(true);
    const [data, setData] = useState('');
    const [width, setWidth] = useState();

    useEffect(() => {
        const chart = `flowchart LR
        classDef 오너일가 fill:${scss.bgBrighter},color:${scss.textBright};
        classDef other fill:${scss.bgMidDark},color:${scss.textDark},font-size:.9em;
        ${share?.chart}`
        if (ref.current) {
            mermaid.render(ref.current.id, chart).then(({ svg }) => {
                setData(svg);
                setChartLoad(false);
            });
        }
    }, [share?.chart, ref?.current]);

    useEffect(() => {
        if (data.length && chartRef?.current) {
            const H = chartRef?.current?.getBoundingClientRect()?.height;
            const svg = chartRef?.current?.firstChild;
            const elem = svg?.querySelector('.subgraphs');
            const width = elem?.getBoundingClientRect()?.width;
            const height = elem?.getBoundingClientRect()?.height;
            if (width > height) {
                setWidth(H * width / height);
            }
        }
    }, [data])
    return (
        <div className="shareMermaid" style={{ width }}>
            <div ref={ref} id={`flow${cnt++}`} className="d">{share?.chart}</div>
            {chartLoad
                ? <Loading left="auto" right="auto" />
                : <div dangerouslySetInnerHTML={{ __html: data }} ref={chartRef} style={{ width }}></div>
            }
        </div>
    );
};

function GroupShareTable({ share, group }) {
    return <table className="fixed">
        <thead>
            <tr>
                <th>오너일가<span className="mh">/재단</span></th>
                <th>소액주주</th>
                <th>연기금<Help
                    title='연기금이란?'
                    span='국민연금, 산업은행, 한국증권금융, 정부 등 '
                /></th>
                <th>상호출자</th>
            </tr>
        </thead>
        <tbody>
            <tr align='center'>
                <td>{Div(share?.owner, group?.p, 1)}</td>
                <td>{Div(share?.ant, group?.p, 1)}</td>
                <td>{Div(share?.gov, group?.p, 1)}</td>
                <td>{Div(share?.inter, group?.p, 1)}</td>
            </tr>
        </tbody>
    </table>
}


const GroupShareElement = ({ share, group }) => {
    const [fixed, setFixed] = useState(false);

    return (
        <div className={`${styles.wrap} `}>
            <h3>지배력 요약</h3>
            <GroupShareTable share={share} group={group} />
            <h3>출자지도</h3>
            <div className={`${styles.chart} ${fixed ? styles.fixed : ''} `}>
                <GroupShareFlow share={share} group={group} />
                <i onClick={e => { setFixed(!fixed); }}><Icon name='FullScreen' /></i>
            </div>
            <p className="des">* 그룹에 대한 지배력이 1%이상인 주주만 표시됩니다.</p>
        </div>
    );
};

export default GroupShareElement;
