/**
 * Highcharts를 사용하는 문서
 * 
 * 상업적 이용은 유료라는 글을 보고 폐기
 */


import colors from '@/module/colors';
import dt from '@/module/dt';
import styles from '@/styles/Chart/Price.module.scss';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import scss from '@/styles/variables.module.scss';
import '@/module/array';
import { parseFix } from '@/module/ba';
import { renderToStaticMarkup } from "react-dom/server"
import { useEffect, useRef, useState } from 'react';
import Help from '../../base/help';

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
    var maxIndex = 0, minIndex = 0;
    const dates = price?.map(e => e.d);
    const priceData = price?.map((e, i) => {
        if (e.c > price[maxIndex].c) {
            maxIndex = i;
        } else if (e.c < price[minIndex].c) {
            minIndex = i;
        }
        return e.c
    });
    const avgData = priceData?.map((e, i) =>
        Math.avg(priceData?.slice(i - num, i + 1)));
    let props = { dates, priceData, avgData, maxIndex, minIndex }
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
    price = [], meta = {},
    addBollinger = false, addEarn = true, N = 120,
}) => {
    price = price.slice(-5 * 252);
    const [num, setNum] = useState(N);
    const [options, setOptions] = useState(defaultOptions);
    useEffect(() => {
        // console.log('price 차트 렌더링중');
        refineData({ price, meta, addBollinger, addEarn, num }).then(({
            dates, maxIndex, minIndex,
            priceData, avgData,
            priceTop, priceBot, stockEps, stockBps
        }) => {
            maxIndex -= num;
            minIndex -= num;
            setOptions(options => ({
                ...options,
                xAxis: {
                    categories: dates.slice(num)
                },
                series: [{
                    name: '종가',
                    data: priceData?.slice(num),
                    color: 'gray',
                    id: 'raw',
                }, {
                    name: `${num}일 이평`,
                    data: avgData?.slice(num),
                    color: colors[0]
                }, {
                    name: `BB상단`,
                    data: priceTop?.slice(num),
                    color: scss.red,
                }, {
                    name: `BB하단`,
                    data: priceBot?.slice(num),
                    color: scss.blue,
                }, {
                    name: `BPS`,
                    data: stockBps?.slice(num),
                    color: scss.redBright,
                }, {
                    name: `EPS`,
                    data: stockEps?.slice(num),
                    color: scss.blueBright,
                },
                {
                    type: 'flags',
                    data: [{
                        x: maxIndex,
                        title: 'MAX',
                        text: 'your text'
                    }, {
                        x: minIndex,
                        title: 'MIN',
                        text: 'your text'
                    }],
                    onSeries: 'raw'
                }],
            }))
        })
    }, [meta])
    return (
        <div className={styles.wrap}>
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