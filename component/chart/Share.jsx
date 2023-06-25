import { Fix } from '@/module/ba';
import colors from '@/module/colors';
import styles from '@/styles/Chart/Share.module.scss';
import { Chart } from "chart.js/auto";
import { useEffect, useState } from 'react';

const ShareChart = ({ stockShare: share, stockMeta }) => {
    if (!share?.length) {
        return (
            <div style={{ textAlign: "center" }}>
                <div className={styles.wrap}>
                    <p>openDart에서 제공된<br />지분 데이터가 없습니다.</p>
                </div>
            </div>
        )
    }
    const amount = stockMeta?.amount;
    let res = amount - share.map(e => e.amount).reduce((a, b) => a + b, 0);
    res = Math.max(0, res);
    const data = share.map(e => Fix(e.amount / amount * 100, 1));
    const labels = share.map(e => e.name);
    data.push(Fix(res / amount * 100, 1));
    labels.push('데이터없음');

    const [isLoad, setLoad] = useState(false);
    const id = 'shareChart';
    const drawChart = (id, option) => {
        let myChart = Chart.getChart(id);
        if (myChart) {
            myChart.clear();
            myChart.destroy();
        }
        new Chart(id, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [option]
            },
            options: {
                spanGaps: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                }
            }
        });
    }

    useEffect(() => {
        if (isLoad) return;
        setLoad(true);
        drawChart(id, {
            data,
            backgroundColor: colors,
            borderWidth: 0
        })
        setLoad(false);
    }, [data]);
    return (
        <div className={styles.wrap}>
            <canvas id={id}></canvas>
        </div>
    )
}

export default ShareChart;