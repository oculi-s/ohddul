import { useEffect, useState } from "react"
import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import { ko } from 'date-fns/locale';
import dt from "@/module/dt";
import styles from '@/styles/Chart/LIne.module.scss';

function Index({ horLine, name, data, height }) {
    const [isLoad, setLoad] = useState();
    data = data || [];
    data = data.sort(dt.lsort).slice(-252);
    const dates = data.map(e => dt.toString(e.date));
    const Raw = data.map(e => e.value);
    const id = 'simpleLineChart';
    useEffect(() => {
        const drawChart = () => {
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
                            // ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
                            ctx.stroke();
                            ctx.restore();
                        }
                    }
                }],
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        data: Raw,
                        label: name,
                        borderColor: "#3e95cd",
                        backgroundColor: "#7bb6dd",
                        pointRadius: 3
                    }]
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
                            ticks: {
                                maxTicksLimit: 5
                            }
                        }
                    }
                }
            });
        }
        setLoad(true);
        drawChart()
        setLoad(false);
    }, [Raw]);

    if (isLoad) {
        return <></>;
    }
    return (
        <div className={styles.wrap}>
            <div>
                <canvas id={id}></canvas>
            </div>
        </div>
    )
}

export default Index;