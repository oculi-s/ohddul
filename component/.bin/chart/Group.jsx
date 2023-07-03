/**
 * Highcharts를 이용해 완벽하게 2중 파이차트를 만들었지만
 * 
 * 상업적 이용이 유료라 2023.06.28 폐기
 */

import colors from '@/module/colors';
import dt from '@/module/dt';
import styles from '$/Index.module.scss';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import scss from '$/variables.module.scss';
import '@/module/array';
import { parseFix } from '@/module/ba';
import { renderToStaticMarkup } from "react-dom/server"
import Link from 'next/link';
import Image from 'next/image';
import groupImg from '@/public/group/Default';
import { useEffect, useState } from 'react';

const groupColors = {
    삼성: '#034ea2',
    SK: '#ea002c',
    LG: '#a50034',
    현대차: '#002c5f',
    POSCO: '#05507d',
    카카오: '#fee500',
    에코프로: '#137ccf',
    셀트리온: '#55b954'
}

const defaultOptions = {
    title: { text: '' },
    credits: { enabled: false },
    chart: {
        type: 'pie',
        backgroundColor: null,
        margin: [0, 0, 0, 0]
    },
    plotOptions: {
        pie: {
            shadow: false,
            center: ['50%', '50%'],
            borderWidth: 0
        }
    },
    responsive: {
        rules: [{
            condition: { maxWidth: 400 },
            chartOptions: {
                series: [{
                }, {
                    id: 'stock',
                    dataLabels: {
                        enabled: false
                    }
                }]
            }
        }]
    }
}

/**
 * async를 통해 data를 수정해서 
 */
async function refineData(data) {
    const stockData = []
    for await (let sub of data?.sort((b, a) => a?.y - b?.y)) {
        const len = sub?.child?.length;
        for await (let i of Array(len).keys()) {
            const e = sub?.child[i];
            let brightness = 0.1 - (i / len) / 5;
            stockData?.push({
                name: e,
                y: sub?.prices[i],
                color: Highcharts?.color(sub?.color)?.brighten(brightness)?.get()
            });
        }
    }
    const res = parseFix(100 - data.map(e => e.y).sum(), 2);
    data?.push({
        name: '나머지',
        y: res,
        color: scss?.bgMid
    })
    stockData?.push({
        name: '나머지',
        y: res,
        color: scss?.bgMid
    })
    return [data, stockData];
}

const Group = ({ group, price, meta }) => {
    group = group?.data || {};
    meta = meta?.data || {};
    const [options, setOptions] = useState(defaultOptions);
    const lastDate = dt.parse(group?.last);
    const total = Object.values(group)?.map(e => e?.price)?.sum() / 100;
    const data = Object.values(group)
        ?.filter(e => e?.price / total >= 2)
        ?.map((e, i) => {
            e.child = e.child?.sort((b, a) =>
                meta[a]?.a * price[a]?.c - meta[b]?.a * price[b]?.c);
            const name = e.name;
            const child = e.child?.map(code => meta[code]?.n);
            const prices = e.child?.map(code => {
                const amount = meta[code]?.a;
                const close = price[code]?.c;
                return parseFix(amount * close / total, 2);
            });
            return {
                name,
                y: parseFix(e?.price / total, 2),
                color: Highcharts?.color(groupColors[name] || colors[i])?.brighten(-0.1)?.get(),
                child, prices,
            }
        });
    useEffect(() => {
        refineData(data).then(([groupData, stockData]) => {
            setOptions({
                ...options,
                tooltip: {
                    backgroundColor: scss?.bgMid,
                    style: { color: scss?.textBright },
                    formatter: function () {
                        return renderToStaticMarkup(<div style={{ backgroundColor: scss?.bgMid, borderWidth: 0 }}>
                            {this.key} :&nbsp;
                            <p style={{ fontSize: 12 }}>{this.y}%</p>
                        </div>)
                    }
                },
                series: [{
                    data: groupData,
                    size: '60%',
                    dataLabels: {
                        useHTML: true,
                        formatter: function () {
                            if (this.key == '나머지') return this.key
                            return renderToStaticMarkup(<div style={{ textAlign: 'center' }}>
                                <a href={`/group/${this.key}`} style={{ display: 'block', height: 25, width: 'max-content' }}>
                                    <Image src={groupImg[this.key]} alt={`${this.key}로고`} style={{ display: 'block', height: '100%' }} />
                                </a>
                                <span style={{ opacity: 0.5, fontSize: 12 }}>{this.y}%</span>
                            </div>)
                        },
                        color: scss?.textBright,
                        distance: -30,
                        style: { fontSize: 16 },
                        filter: {
                            property: 'y',
                            operator: '>',
                            value: 5
                        },
                    }
                }, {
                    data: stockData,
                    size: '80%',
                    innerSize: '60%',
                    dataLabels: {
                        formatter: function () {
                            if (this.key == '나머지') return this.key
                            return renderToStaticMarkup(<div>
                                <Link href={`/stock/${this.key}`} style={{ color: scss?.anchor, fontWeight: 'bold' }}>{this.key}</Link><br />
                                <span style={{ opacity: .5 }}>{this.y}%</span>
                            </div>)
                        },
                        filter: {
                            property: 'y',
                            operator: '>',
                            value: 1
                        },
                        style: {
                            fontWeight: 'normal',
                            fontSize: 14
                        }
                    },
                    id: 'stock'
                }],
            })
        })
    }, [])
    if (!meta) return;
    return <>
        <div className={`${styles.area} ${styles.groupArea}`}>
            <h3>오늘의 시가총액</h3>
            <div className={styles.chart}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </div>
            <p className='des'>기준일 : {lastDate}</p>
        </div>
    </>
}

export default Group;