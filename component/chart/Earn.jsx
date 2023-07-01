import 'chartjs-adapter-date-fns';
import styles from '@/styles/Chart/Earn.module.scss';
import { Bar } from "react-chartjs-2";
import { hairline } from './plugins';
import dt from '@/module/dt'
import { useEffect, useState } from 'react';
import scss from '@/styles/variables.module.scss';
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

function EarnChart({
    stockEarn: earn, stockMeta,
}) {
    if (!earn?.length) {
        return (
            <div style={{ textAlign: "center" }}>
                <div className={styles.wrap}>
                    <p>openDart에서 제공된<br />실적 데이터가 없습니다.</p>
                </div>
                <div className={styles.wrap}>
                    <p>openDart에서 제공된<br />실적 데이터가 없습니다.</p>
                </div>
            </div>
        )
    }
    const amount = stockMeta?.a || 1;
    earn = earn || [];
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
        console.log('earn 차트 렌더링중');
        const ismob = window.innerWidth <= Int(scss.mobWidth);
        const option = { scales: { y: {} } };
        if (ismob) option.scales.y.display = false;
        else option.scales.y.display = true;
        setOptions(merge(defaultOptions, option));
        setEquity(refineData(equityData, '자본(BPS)'));
        setProfit(refineData(profitData, '이익(EPS)'));
    }, [earn])

    return (
        <div className={styles.wrap}>
            <div className={styles.chart}>
                <Bar
                    plugins={plugins}
                    options={options}
                    data={equity}
                />
            </div>
            <div className={styles.chart}>
                <Bar
                    plugins={plugins}
                    options={options}
                    data={profit}
                />
            </div>
        </div>
    )
}

export default EarnChart;