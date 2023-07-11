import 'chartjs-adapter-date-fns';
import styles from '$/Chart/Earn.module.scss';
import { Bar } from "react-chartjs-2";
import { hairline } from '../../module/chart/plugins';
import dt from '@/module/dt'
import { useEffect, useState } from 'react';
import scss from '$/variables.module.scss';
import { Int } from '@/module/ba';
import merge from 'deepmerge';

const defaultOptions = {
    plugins: {
        tooltip: {
            callbacks: {
                title: function (ctx) {
                    return dt.toQuar(ctx[0]?.label);
                },
            },
        },
        legend: { display: false }
    },
    animation: { duration: 300 },
    interaction: { intersect: false, mode: 'index', },
    spanGaps: true,
    maintainAspectRatio: false,
    responsive: true,
    scales: { x: { display: false }, y: {} },
}

const plugins = [hairline];

function EarnChart({ earn, stockMeta }) {
    const amount = stockMeta?.a || 1;
    earn = earn.sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = earn.map(e => e.date);
    const profitData = earn.map(e => Math.round(e.profit / amount));
    const equityData = earn.map(e => Math.round(e.equity / amount));

    const [options, setOptions] = useState(defaultOptions);
    const [equity, setEquity] = useState({ labels: [], datasets: [] });
    const [profit, setProfit] = useState({ labels: [], datasets: [] });

    const refineData = (data, label) => {
        return {
            labels,
            datasets: [{
                data, label,
                borderColor: data.map(e => e > 0 ? scss.red : scss.blue),
                backgroundColor: data.map(e => e > 0 ? scss.red : scss.blue),
                borderWidth: 0,
                pointRadius: 1
            }]
        }
    }

    useEffect(() => {
        if (earn?.length) {
            console.log('earn 차트 렌더링중');
            const ismob = window.innerWidth <= Int(scss.mobWidth);
            const option = { scales: { y: {} } };
            if (ismob) option.scales.y.display = false;
            else option.scales.y.display = true;
            setOptions(merge(defaultOptions, option));
            setEquity(refineData(equityData, '자본(BPS)'));
            setProfit(refineData(profitData, '이익(EPS)'));
        }
    }, [earn])

    const NULL = <p>API에서 제공된<br />실적 데이터가 없습니다.</p>;
    return (
        <div className={styles.wrap}>
            <div className={styles.chart}>
                {earn.length ? <Bar
                    plugins={plugins}
                    options={options}
                    data={equity}
                /> : NULL}
            </div>
            <div className={styles.chart}>
                {earn.length ? <Bar
                    plugins={plugins}
                    options={options}
                    data={profit}
                /> : NULL}
            </div>
        </div>
    )
}

export default EarnChart;