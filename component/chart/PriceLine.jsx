import { useEffect, useState } from "react"
import "chart.js/auto";
import 'chartjs-adapter-date-fns';
import styles from '@/styles/Chart/Price.module.scss';
import dt from "@/module/dt";
import { Line } from "react-chartjs-2";
import colors from "@/module/colors";
import scss from '@/styles/variables.module.scss';
import '@/module/array'

/**
 * tooltip custom 하는 방법
 * 
 * interaction : hover에서 
 */
const options = {
    plugins: {
        tooltip: {
            callbacks: {
                // title: function (tooltipItem, data) {
                //     return dt.toString(tooltipItem[0]?.label);
                // },
                // label: function (tooltipItem, data) {
                //     return data;
                // },
                // afterLabel: function (tooltipItem, data) {
                //     let percent = 1;
                //     return '(' + percent + '%)';
                // }
            },
        },
        legend: {}
    },
    interaction: { intersect: false, mode: 'index', },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: { x: {}, y: {} }
}

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
            ctx.strokeStyle = colors[0];
            ctx.stroke();
            ctx.restore();
        }
    }
}];

async function getData({ price, amount, addEarn, addBollinger, num }) {
    price = price?.sort(dt.lsort);
    const dates = price?.map(e => e.d);
    const priceRaw = price?.map(e => e.c);
    const priceAvg = priceRaw?.map((e, i) => Math.avg(priceRaw?.slice(i - num, i)))
    let props = { dates, priceRaw, priceAvg };

    if (addBollinger) {
        const priceTop = priceAvg?.map((e, i) => Math.std(priceRaw?.slice(i - num, i), 2))
        const priceBot = priceAvg?.map((e, i) => Math.std(priceRaw?.slice(i - num, i), -2))
        props = { ...props, priceTop, priceBot };
    }

    if (addEarn) {
        const stockEps = price?.map(e => Math.round(e?.eps / amount));
        const stockBps = price?.map(e => Math.round(e?.bps / amount));
        props = { ...props, stockEps, stockBps };
    }
    return props;
}

async function refineData({
    prices, metas, addEarn, addBollinger, num,
}) {
    let datasets = [], date;
    const len = prices?.length;
    for await (let i of Array(len).keys()) {
        const price = prices[i];
        const amount = metas[i]?.a;
        const {
            dates,
            priceRaw, priceAvg,
            priceTop, priceBot,
            stockEps, stockBps
        } = await getData({ price, amount, addEarn, addBollinger, num });
        date = dates?.slice(num);
        datasets = [{
            data: priceAvg?.slice(num),
            label: `${num}일 이평`,
            fill: false,
            borderColor: colors[i],
            backgroundColor: colors[i],
            borderWidth: 1.5,
            pointRadius: 0
        }, {
            data: priceRaw?.slice(num),
            label: '종가',
            borderColor: 'gray',
            borderWidth: 1,
            pointRadius: 0
        }, ...datasets];
        if (addEarn) {
            const def = { borderWidth: 2, pointRadius: 0 }
            datasets = [{
                data: stockEps?.slice(num),
                label: "EPS",
                borderColor: scss?.red,
                backgroundColor: scss?.red,
                ...def
            }, {
                data: stockBps?.slice(num),
                label: "BPS",
                borderColor: scss?.blue,
                backgroundColor: scss?.blue,
                ...def
            }, ...datasets];
        }
        if (addBollinger) {
            const def = { borderWidth: 1, pointRadius: 0 }
            datasets = [{
                data: priceTop?.slice(num),
                label: "BB상단",
                borderColor: scss?.red,
                backgroundColor: scss?.red,
                ...def
            }, {
                data: priceBot?.slice(num),
                label: "BB하단",
                borderColor: scss?.blue,
                backgroundColor: scss?.blue,
                ...def
            }, ...datasets]
        }
    }
    return { labels: date, datasets };
}

function PriceLine({
    prices = [{}], metas = [{}],
    addEarn = true, addBollinger = false, N = 60,
    x = false, y = false, legend = false,
}) {
    options.plugins.legend.display = legend;
    options.scales.x.display = x;
    options.scales.y.display = y;
    const [num, setNum] = useState(N);
    const [data, setData] = useState({ labels: [], datasets: [] });
    prices = prices.map(price => {
        price?.sort(dt.sort);
        return price?.slice(0, 5 * 252);
    })
    useEffect(() => {
        console.log('price 차트 렌더링중')
        refineData({
            prices, metas, addEarn, addBollinger, num,
        }).then(r => { setData(r); })
    }, [metas, addEarn, addBollinger, num])
    return (
        <div className={styles.wrap}>
            <div className={styles.buttonGroup}>
                <button>asdf</button>

            </div>
            <div className={styles.chart}>
                <Line
                    options={options}
                    plugins={plugins}
                    data={data}
                />
            </div>
        </div >
    )
}

export default PriceLine;