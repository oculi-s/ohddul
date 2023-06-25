import { useState } from "react"
import "chart.js/auto";
import 'chartjs-adapter-date-fns';
import { ko } from 'date-fns/locale';
import Help from "@/component/base/help";
import styles from '@/styles/Chart/Price.module.scss';
import dt from "@/module/dt";
import { Line } from "react-chartjs-2";
import colors from "@/module/colors";

Math.avg = (d) => {
    return Math.round(d.reduce((a, b) => a + b, 0) / d.length);
}
Math.std = (d, k) => {
    let mean = Math.avg(d);
    let diff = d.map(e => (e - mean) * (e - mean)).reduce((a, b) => a + b, 0);
    return Math.round(mean + k * Math.sqrt(diff / d.length));
}

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
    },
    interaction: { intersect: false, mode: 'index', },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: "time",
            adapters: { date: { locale: ko, }, },
            time: {
                unit: 'day',
                unitStepSize: 1,
                tooltipFormat: "yyyy-MM-dd",
            },
            ticks: { maxTicksLimit: 5 }
        }
    }
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

function refineData({ price, amount, addEarn, addBollinger, N }) {
    price = price?.sort(dt.lsort);
    const dates = price?.map(e => e.date);
    const priceRaw = price?.map(e => e.close);
    const priceAvg = priceRaw?.map((e, i) => Math.avg(priceRaw?.slice(i - N, i)))
    let props = { dates, priceRaw, priceAvg };

    if (addBollinger) {
        const priceTop = priceAvg?.map((e, i) => Math.std(priceRaw?.slice(i - N, i), 2))
        const priceBot = priceAvg?.map((e, i) => Math.std(priceRaw?.slice(i - N, i), -2))
        props = { ...props, priceTop, priceBot };
    }

    if (addEarn) {
        const stockEps = price?.map(e => Math.round(e?.eps / amount));
        const stockBps = price?.map(e => Math.round(e?.bps / amount));
        props = { ...props, stockEps, stockBps };
    }
    return props;
}

function getData({ prices, metas, addEarn, addBollinger, N }) {
    let datasets = [], date;
    prices.forEach((price, i) => {
        const amount = metas[i]?.amount;
        const name = metas[i]?.name;
        const {
            dates, priceRaw, priceAvg, priceTop, priceBot, stockEps, stockBps
        } = refineData({ price, amount, addEarn, addBollinger, N });
        date = dates;
        datasets = [
            {
                data: priceAvg,
                label: `${name || ''} ${N}일 이평`,
                fill: false,
                borderColor: colors[i],
                backgroundColor: colors[i],
                borderWidth: 1.5,
                pointRadius: 0
            },
            {
                data: priceRaw,
                label: name || '종가',
                borderColor: "#2e2e4a",
                backgroundColor: "#2e2e4a",
                borderWidth: 1,
                pointRadius: 0
            },
            ...datasets
        ];
        if (addEarn) {
            const def = { lineTension: 0, borderWidth: 2, pointRadius: 0 }
            datasets = [
                {
                    data: stockEps,
                    label: "EPS",
                    borderColor: "#A6D0DD",
                    backgroundColor: "#A6D0DD",
                    ...def
                },
                {
                    data: stockBps,
                    label: "BPS",
                    borderColor: "#FF6969",
                    backgroundColor: "#FF6969",
                    ...def
                },
                ...datasets
            ];
        }
        if (addBollinger) {
            const def = { borderWidth: 1, pointRadius: 0 }
            datasets = [
                {
                    data: priceTop,
                    label: "BB상단",
                    borderColor: "#FF6969",
                    backgroundColor: "#FF6969",
                    ...def
                }, {
                    data: priceBot,
                    label: "BB하단",
                    borderColor: "#A6D0DD",
                    backgroundColor: "#A6D0DD",
                    ...def
                },
                ...datasets
            ]
        }
    });
    return { labels: date, datasets };
}

function PriceChart({
    prices = [{}], metas = [{}],
    addEarn = true, addBollinger,
}) {
    let [N, setN] = useState(20);
    prices = prices.map(price => {
        price?.sort(dt.sort);
        return price?.slice(0, 5 * 252);
    })
    const props = {
        des: ' 도움말',
        data: <>
            {
                addBollinger ?
                    <><tr><th>%B</th><td>(현재가-하단가) / 밴드길이<br />낮을수록 상승가능성 높음</td></tr>
                        <tr><th>%BW</th><td>밴드길이 / 현재가<br />낮을수록 가격변동성 높음</td></tr></> : null
            }
            {
                addEarn ?
                    <><tr><th>BPS</th><td>(분기별 자본금) / (발행 주식)</td></tr>
                        <tr><th>EPS</th><td>(초기자본 + 누적이익) / (발행 주식)</td></tr></> : null
            }
        </>
    };
    return (
        <div className={styles.wrap}>
            <Help {...props} />
            <div className={styles.chart}>
                <Line
                    options={options}
                    plugins={plugins}
                    data={
                        getData({ prices, metas, addEarn, addBollinger, N })
                    }
                />
            </div>
        </div >
    )
}

export default PriceChart;