import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import groupColors from '@/public/group/color';
import colors from '@/module/colors';
import merge from 'deepmerge';
import { Div, Price } from '@/module/ba';
import scss from '$/variables.module.scss';
import '@/module/array';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

function refineData({ group, price, meta }) {
    const series = group
        .filter(e => e.price)
        .slice(0, 10)
        .map(({ name, child }) => ({
            name,
            data: child?.map(e => ({
                x: e,
                y: meta[e]?.a * price[e]?.c,
                label: {
                    rotate: 0
                },
                strokeWidth: 0
            })),
        }));
    return series;
}

const defaultOptions = {
    grid: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
    legend: {
        show: true,
        // style: { color: scss.textBright }
    },
    chart: {
        type: 'treemap',
        toolbar: { show: false },
        animations: { speed: 200 },
        events: {
            dataPointMouseEnter: function (e) {
                e.target.style.cursor = "pointer";
            }
        }
    },
    plotOptions: {
        treemap: {
            enableShades: true,
            shadeIntensity: 0.2,
            reverseNegativeShade: true,
            borderColor: 'transparent',
            strokeWidth: 0,
            strokeWidth: 0,
            dataLabels: {
                orientation: 'horizontal'
            }
        }
    },
};

const TreemapChart = ({ group, meta, price }) => {
    group = group?.data
    meta = meta?.data;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState(defaultOptions);
    const total = Object.keys(meta)
        .filter(e => price[e]?.c && meta[e]?.a)
        .map(e => price[e].c * meta[e].a).sum();
    const groups = Object.values(group)
        ?.filter(e => e.price)
        ?.sort((b, a) => a.price - b.price);
    groups?.forEach(e => {
        e?.child?.sort((b, a) =>
            meta[a]?.a * price[a]?.c - meta[b]?.a * price[b]?.c)
    });
    useEffect(() => {
        const series = refineData({ group: groups, meta, price });
        const option = {
            series,
            colors: groups.map((e, i) => groupColors[e.name] || colors[i]),
            legend: {
                formatter: function (name, opts) {
                    const i = opts.seriesIndex;
                    return [name, Div(groups[i]?.price, total, 1)]
                },
                labels: {
                    colors: groups.map(e => scss.textBright)
                },
                tooltipHoverFormatter: function (seriesName, opts) {
                    console.log(opts)
                    return seriesName + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
                },
                fontSize: '14px',
                style: { padding: 10, },
                itemMargin: { horizontal: 10 },
                height: 60
            },
            chart: {
                events: {
                    dataPointSelection: function (e, ctx, opts) {
                        const i = opts?.seriesIndex;
                        const j = opts?.dataPointIndex;
                        const code = groups[i]?.child[j];
                        router.push(`/stock/${code}`)
                    }, legendClick: function (ctx, i, config) {
                        router.push(`/group/${groups[i]?.name}`)
                    }
                }
            },
            dataLabels: {
                useHtml: true,
                style: { fontSize: '14px' },
                formatter: function (e, op) {
                    return [meta[e]?.n, Div(op.value, total, 1)]
                },
                offsetY: -4,
            },
            tooltip: {
                x: {
                    show: true,
                    formatter: function (text, opts) {
                        const i = opts?.seriesIndex;
                        const j = opts?.dataPointIndex;
                        const e = groups[i]?.child[j];
                        return meta[e]?.n;
                    }
                }, y: {
                    formatter: function (text, opts) {
                        const i = opts?.seriesIndex;
                        const j = opts?.dataPointIndex;
                        const e = groups[i]?.child[j];
                        const v = price[e]?.c * meta[e]?.a;
                        return `${Price(v)} ${Div(v, total, 2)}`;
                    }
                }
            },
            stroke: { show: false },
        }
        setLoading(true);
        setOptions(merge(defaultOptions, option));
    }, []);


    if (!loading) return <>로딩중입니다.</>

    return (
        <Chart
            type='treemap'
            options={options}
            series={options.series}
            height={'100%'}
            width={'100%'}
        />
    );
};

export default TreemapChart;
