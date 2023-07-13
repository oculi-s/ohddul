import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import dt from "@/module/dt";
import styles from '$/Chart/LIne.module.scss';
import scss from '$/variables.module.scss';
import { Line } from "react-chartjs-2";
import { parseFix } from "@/module/ba";
import { getRank } from "#/User";
import '@/module/array';
import { hairline } from "@/module/chart/plugins";
import Annotation from "chartjs-plugin-annotation";
Chart.register(Annotation);

const plugins = [hairline, Annotation];

const options = {
    plugins: {
        legend: { display: false },
        annotation: {
            drawTime: 'afterDatasetsDraw',
        },
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
                maxTicksLimit: 5,
                callback: function (value) {
                    return dt.parse(value);
                }
            }
        }
    },
}

function Index({ rank, name, data, load }) {
    data?.qsort(dt.lsort)?.slice(-252);
    const dates = data.map(e => e.d);
    var s = 1000;
    data = data.map(({ d, v }) => {
        s += v;
        return parseFix(s, 1);
    })
    const [color, num, next] = getRank(rank);
    const chartData = {
        labels: dates,
        datasets: [{
            data,
            borderColor: scss[color] || scss.unranked,
            backgroundColor: scss[color] || scss.unranked,
            borderWidth: 1,
            pointRadius: 0
        }]
    }
    return (
        <div className={styles.wrap}>
            <div>
                <Line {...{ options, plugins, data: chartData }} />
            </div>
        </div>
    )
}

export default Index;