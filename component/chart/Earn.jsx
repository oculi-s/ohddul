import { useEffect, useState } from "react"
import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import { ko } from 'date-fns/locale';
import styles from '@/styles/Chart/Earn.module.scss';
import Help from "@/component/base/help";

function EarnChart({ stockEarn: earn, stockMeta }) {
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
    const amount = stockMeta?.amount || 1;
    const [isLoad, setLoad] = useState(false);
    earn = earn || [];
    earn = earn.sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = earn.map(e => e.date);
    const profitData = earn.map(e => Math.round(e.profit / amount));
    const equityData = earn.map(e => Math.round(e.equity / amount));
    const profitId = 'profitChart';
    const equityId = 'revenueChart';
    const drawChart = (id, option) => {
        let myChart = Chart.getChart(id);
        if (myChart) {
            myChart.clear();
            myChart.destroy();
        }
        new Chart(id, {
            plugins: [{
                afterDraw: chart => {
                    if (chart.tooltip?._active?.length) {
                        let x = chart.tooltip._active[0].element.x;
                        let yAxis = chart.scales.y;
                        let ctx = chart.ctx;
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x, yAxis.top);
                        ctx.lineTo(x, yAxis.bottom);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "#3e95cd";
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }],
            type: 'line',
            data: {
                labels: dates,
                datasets: [option]
            },
            options: {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                spanGaps: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: "time",
                        adapters: {
                            date: {
                                locale: ko,
                            },
                        },
                        time: {
                            unit: 'day',
                            unitStepSize: 1,
                            tooltipFormat: "yyyy-MM",
                            // displayFormats: {
                            //     'day': 'MM-dd'
                            // },
                        },
                        ticks: {
                            maxTicksLimit: 5
                        }
                    }
                }
            }
        });
    }
    useEffect(() => {
        if (isLoad) return;
        setLoad(true);
        drawChart(profitId, {
            data: profitData,
            label: '이익(eps)',
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            borderWidth: 2,
            pointRadius: 1
        })
        drawChart(equityId, {
            data: equityData,
            label: '순자산(bps)',
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            borderWidth: 2,
            pointRadius: 1
        })
        setLoad(false);
    }, [profitData, equityData]);

    if (isLoad) {
        return <></>;
    }
    const props = {
        des: ' 도움말', data: <>
            <tr><th>BPS</th><td>(분기별 자본금) / (발행 주식)</td></tr>
            <tr><th>EPS</th><td>(당기순이익) / (발행 주식)</td></tr>
        </>
    }
    return (
        <div>
            <Help {...props} />
            <div className={styles.wrap}>
                <div className={styles.chart}>
                    <canvas id={equityId}></canvas>
                </div>
                <div className={styles.chart}>
                    <canvas id={profitId}></canvas>
                </div>
            </div>
        </div>
    )
}

export default EarnChart;