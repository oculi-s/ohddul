import { useEffect, useState } from "react"
import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import { ko } from 'date-fns/locale';
import Help from "@/component/base/help";
import styles from '@/styles/Chart/Price.module.scss';
import dt from "@/module/dt";

Math.avg = (d) => {
    return Math.round(d.reduce((a, b) => a + b, 0) / d.length);
}
Math.std = (d, k) => {
    let mean = Math.avg(d);
    let diff = d.map(e => (e - mean) * (e - mean)).reduce((a, b) => a + b, 0);
    return Math.round(mean + k * Math.sqrt(diff / d.length));
}

const drawChart = (id, { dates, datasets }) => {
    const myChart = Chart.getChart(id);
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
        data: {
            labels: dates,
            datasets
        },
        options: {
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
                        tooltipFormat: "yyyy-MM-dd",
                    },
                    ticks: {
                        maxTicksLimit: 5
                    }
                }
            }
        }
    });
}

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

const colors = ['#3cba9f', 'red']
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
                type: 'line',
                data: priceAvg,
                label: `${name || ''} ${N}일 이평`,
                fill: false,
                borderColor: colors[i],
                backgroundColor: colors[i],
                borderWidth: 1.5,
                pointRadius: 0
            },
            {
                type: 'line',
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
            datasets = [
                {
                    type: 'line',
                    data: stockEps,
                    label: "EPS",
                    borderColor: "#A6D0DD",
                    backgroundColor: "#A6D0DD",
                    lineTension: 0,
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    type: 'line',
                    data: stockBps,
                    label: "BPS",
                    borderColor: "#FF6969",
                    backgroundColor: "#FF6969",
                    lineTension: 0,
                    borderWidth: 2,
                    pointRadius: 0
                },
                ...datasets
            ];
        }
        if (addBollinger) {
            datasets = [
                {
                    type: 'line',
                    data: priceTop,
                    label: "BB상단",
                    borderColor: "#FF6969",
                    backgroundColor: "#FF6969",
                    borderWidth: 1,
                    pointRadius: 0
                }, {
                    type: 'line',
                    data: priceBot,
                    label: "BB하단",
                    borderColor: "#A6D0DD",
                    backgroundColor: "#A6D0DD",
                    borderWidth: 1,
                    pointRadius: 0
                },
                ...datasets
            ]
        }
    });
    return { dates: date, datasets };
}

function PriceChart({
    prices = [{}], metas = [{}],
    addEarn = true, addBollinger,
}) {
    let [N, setN] = useState(20);
    let [isLoad, setLoad] = useState();
    const id = `chart${parseInt(Math.random() * 100)}`;
    prices = prices.map(price => {
        price?.sort(dt.sort);
        return price?.slice(0, 5 * 252);
    })
    useEffect(() => {
        drawChart(id, getData({
            prices, metas, addEarn, addBollinger, N
        }));
    });

    // let lastPrice = price.slice(-1)[0]?.close;
    // let lastTop = priceTop.slice(-1)[0];
    // let lastBot = priceBot.slice(-1)[0];
    // let percentB = (lastPrice - lastBot) / (lastTop - lastBot);
    // let percentBW = (lastTop - lastBot) / lastPrice;
    if (isLoad) {
        return <></>;
    }
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
                <canvas id={id}></canvas>
            </div>
        </div >
    )
}

export default PriceChart;