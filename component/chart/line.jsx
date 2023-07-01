import "chart.js/auto";
import 'chartjs-adapter-date-fns';
import { ko } from 'date-fns/locale';
import dt from "@/module/dt";
import styles from '@/styles/Chart/LIne.module.scss';
import { Line } from "react-chartjs-2";

const plugins = [{
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
}]

const options = {
    interaction: {
        intersect: false,
        mode: 'index',
    },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: "time",
            adapters: { date: { locale: ko, }, },
            ticks: { maxTicksLimit: 5 }
        }
    }
}

function Index({ horLine, name, data, height }) {
    data = data || [];
    data = data.sort(dt.lsort).slice(-252);
    const dates = data.map(e => dt.toString(e.date));
    const Raw = data.map(e => e.value);
    const chartData = {
        labels: dates,
        datasets: [{
            data: Raw,
            label: name,
            borderColor: "#3e95cd",
            backgroundColor: "#7bb6dd",
            pointRadius: 3
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