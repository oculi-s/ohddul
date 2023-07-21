import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import dt from "@/module/dt";
import styles from '$/Chart/LIne.module.scss';
import scss from '$/variables.module.scss';
import { Line } from "react-chartjs-2";
import { H2R, Int, parseFix } from "@/module/ba";
import { getRank } from "#/User";
import { hairline } from "@/module/chart/plugins";
import Annotation from "chartjs-plugin-annotation";
import { Loading } from "#/base/base";
import '@/module/array';
import { useEffect, useState } from "react";
import deepmerge from "deepmerge";
Chart.register(Annotation);

const plugins = [hairline, Annotation];

const defaultOptions = {
    plugins: {
        legend: { display: false },
        annotation: {
            drawTime: 'afterDatasetsDraw',
        },
        tooltip: {
            callbacks: {
                label: function (ctx) {
                    const [prev, cur] = getRank(ctx?.raw);
                    return `${cur.color?.slice(0, 1)?.toUpperCase()}${cur.num} ${ctx?.raw}`;
                },
                labelColor: function (ctx) {
                    const [prev, cur] = getRank(ctx?.raw);
                    return {
                        backgroundColor: scss[cur?.color],
                        borderColor: scss[cur?.color],
                        borderWidth: 0,
                    };
                }
            }
        }
    },
    animation: {
        x: { duration: 0 },
        duration: 100
    },
    interaction: { intersect: false, mode: 'index', },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: "time",
            time: {
                tooltipFormat: "yyyy-MM-dd"
            },
            ticks: {
                maxTicksLimit: 3,
                callback: function (value) {
                    return dt.parse(value);
                }
            }
        },
        y: {}
    },
}

function HistLine({ rank, signed, data, load }) {
    const [prev, cur, next] = getRank(rank);
    const [chartData, setData] = useState({ labels: [], datasets: [] });
    const [options, setOptions] = useState(defaultOptions);
    useEffect(() => {
        data.push({ d: signed, v: 0 });
        data?.qsort(dt.lsort)?.slice(-252);
        if (data.findIndex(e => e.d == dt.parse()) == -1) {
            data?.push({ d: dt.num(), v: 0 });
        }
        const dates = data.map(e => e.d);
        options.scales.x.max = dt.num();
        var s = 1000;
        data = data.map(({ d, v }) => {
            s += v;
            return parseFix(s, 1);
        })
        setData({
            labels: dates,
            datasets: [{
                data,
                borderColor: scss[cur.color] || scss.unranked,
                backgroundColor: scss[cur.color] || scss.unranked,
                borderWidth: 2,
                pointRadius: 0
            }]
        });
        const option = { scales: { y: {} }, plugins: {} }
        option.scales.y.min = Int(Math.min(...data)) - 3;
        option.scales.y.max = Int(Math.max(...data)) + 3;
        option.plugins.annotation = {
            annotations: [
                {
                    type: 'box',
                    yMin: prev.score, yMax: cur.score,
                    borderColor: H2R(scss[prev.color], .3),
                    backgroundColor: H2R(scss[prev.color], .3),
                    borderDash: [5, 5],
                    borderWidth: 1,
                },
                {
                    type: 'box',
                    yMin: cur.score, yMax: next.score,
                    borderColor: H2R(scss[cur.color], .3),
                    backgroundColor: H2R(scss[cur.color], .3),
                    borderDash: [5, 5],
                    borderWidth: 1,
                }, {
                    type: 'label',
                    color: scss[cur.color],
                    content: `${cur.color?.slice(0, 1)?.toUpperCase()}${cur.num}`,
                    font: { size: 14, family: 'sans-serif' },
                    position: {
                        x: 'end',
                        y: 'center'
                    },
                    xValue: dt.num(),
                    yValue: cur.score,
                }, {
                    type: 'label',
                    color: scss[next.color],
                    content: `${next.color?.slice(0, 1)?.toUpperCase()}${next.num}`,
                    font: { size: 14, family: 'sans-serif' },
                    position: {
                        x: 'end',
                        y: 'center'
                    },
                    xValue: dt.num(),
                    yValue: next.score,
                }
            ]
        }
        setOptions(deepmerge(defaultOptions, option));
    }, [load?.hist, data])

    return (
        <div className={styles.wrap}>
            <div>
                {load?.hist
                    ? <Loading left="auto" right="auto" />
                    : <Line
                        options={options}
                        plugins={plugins}
                        data={chartData}
                    />}
            </div>
        </div>
    )
}

export default HistLine;