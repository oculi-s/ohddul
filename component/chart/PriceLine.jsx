import colors from '@/module/colors';
import dt from '@/module/dt';
import styles from '@/styles/Chart/Price.module.scss';
import Highcharts, { color } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import scss from '@/styles/variables.module.scss';
import '@/module/array';
import { parseFix } from '@/module/ba';
import { renderToStaticMarkup } from "react-dom/server"
import { useEffect, useRef, useState } from 'react';
import Help from '../base/help';

const defaultOptions = {
    title: { text: '' },
    credits: { enabled: false },
    legend: { enabled: false },
    chart: {
        type: 'line',
        backgroundColor: null,
        margin: [0, 0, 0, 0],
    },
    xAxis: {
        crosshair: true,
    },
    yAxis: {
        visible: false
    },
    tooltip: {
        shared: true,
        useHTML: true,
        // formatter: function () {
        //     var points = this.points;
        //     var pointsLength = points.length;
        //     var tooltipMarkup = pointsLength ? '<span style="font-size: 10px">' + points[0].key + '</span><br/>' : '';
        //     var index;
        //     var y_value_kwh;

        //     for (index = 0; index < pointsLength; index += 1) {
        //         y_value_kwh = (points[index].y / 1000).toFixed(2);

        //         tooltipMarkup += '<span style="color:'
        //             + points[index].series.color
        //             + '">\u25CF</span> '
        //             + points[index].series.name
        //             + ': <b>' + y_value_kwh
        //             + ' </b><br/>';
        //     }

        //     return tooltipMarkup;
        // }
    }
}

async function refineData({
    price, meta, addEarn, addBollinger, num,
}) {
    price = price?.sort(dt.lsort);
    const dates = price?.map(e => e.d);
    const priceData = price?.map(e => e.c);
    const avgData = priceData?.map((e, i) =>
        Math.avg(priceData?.slice(i - num, i + 1)));
    let props = { dates, priceData, avgData }
    if (addBollinger) {
        const priceTop = avgData?.map((e, i) =>
            Math.std(priceData?.slice(i - num, i), 2));
        const priceBot = avgData?.map((e, i) =>
            Math.std(priceData?.slice(i - num, i), -2));
        props = { ...props, priceTop, priceBot };
    }
    if (addEarn) {
        const amount = meta?.a;
        const stockEps = price?.map(e => Math.round(e?.eps / amount));
        const stockBps = price?.map(e => Math.round(e?.bps / amount));
        props = { ...props, stockEps, stockBps };
    }
    return props;
}

const PriceChart = ({
    price = [], meta = {}, help = true,
    addBollinger = false, addEarn = true, N = 120,
}) => {
    price = price.slice(252);
    const [num, setNum] = useState(N);
    const [options, setOptions] = useState(defaultOptions);
    useEffect(() => {
        refineData({
            price, meta, addEarn, addBollinger, num
        }).then(({ dates, priceData, avgData, priceTop, priceBot, stockEps, stockBps }) => {
            setOptions({
                ...options,
                xAxis: {
                    categories: dates.slice(N)
                },
                series: [{
                    name: '종가',
                    data: priceData?.slice(N),
                    color: 'gray'
                }, {
                    name: `${N}일 이평`,
                    data: avgData?.slice(N),
                    color: colors[0]
                }, {
                    name: `BB상단`,
                    data: priceTop?.slice(N),
                    color: scss.red,
                }, {
                    name: `BB하단`,
                    data: priceBot?.slice(N),
                    color: scss.blue,
                }, {
                    name: `BPS`,
                    data: stockBps?.slice(N),
                    color: scss.redBright,
                }, {
                    name: `EPS`,
                    data: stockEps?.slice(N),
                    color: scss.blueBright,
                }],
            })
        })
    }, [])
    const props = {
        des: ' 도움말',
        data: <>{addBollinger &&
            <>
                <tr><th>%B</th><td>(현재가-하단가) / 밴드길이<br />낮을수록 상승가능성 높음</td></tr>
                <tr><th>%BW</th><td>밴드길이 / 현재가<br />낮을수록 가격변동성 높음</td></tr>
            </>}
            {addEarn &&
                <>
                    <tr><th>BPS</th><td>(분기별 자본금) / (발행 주식)</td></tr>
                    <tr><th>EPS</th><td>(초기자본 + 누적이익) / (발행 주식)</td></tr>
                </>}
        </>
    };
    return (
        <div className={styles.wrap}>
            {help && <Help {...props} />}
            <div className={styles.chart}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </div>
        </div >
    )
}

export default PriceChart;