import colors from '@/module/colors';
import dt from '@/module/dt';
import styles from '$/Index.module.scss';
import Highcharts, { color } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import scss from '$/variables.module.scss';
import '@/module/array';
import { parseFix } from '@/module/ba';
import { renderToStaticMarkup } from "react-dom/server"
import { useEffect, useRef, useState } from 'react';
import Help from '../../base/Help';

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
    price, addBollinger, num,
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
    return props;
}

const IndexChart = ({
    price = [], meta = {},
    addBollinger = false, N = 20,
}) => {
    const [num, setNum] = useState(N);
    const [options, setOptions] = useState(defaultOptions);
    useEffect(() => {
        refineData({
            price, meta, addBollinger, num
        }).then(({ dates, priceData, avgData, priceTop, priceBot }) => {
            setOptions({
                ...options,
                xAxis: {
                    categories: dates.slice(num)
                },
                series: [{
                    name: '종가',
                    data: priceData?.slice(num),
                    color: 'gray'
                }, {
                    name: `${N}일 이평`,
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
                }],
            })
        })
    }, [])
    return <HighchartsReact
        highcharts={Highcharts}
        options={options}
    />
}

export default IndexChart;