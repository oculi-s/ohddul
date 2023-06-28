import colors from '@/module/colors';
import dt from '@/module/dt';
import styles from '@/styles/Index.module.scss';
import Highcharts from 'highcharts'
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
    chart: {
        type: 'line',
        backgroundColor: null,
        margin: [0, 0, 0, 0],
    },
    xAxis: {
        crosshair: true
    },
    plotOptions: {
    },
}

async function refineData({
    price, meta, addEarn, addBollinger, num,
}) {
    const amount = meta?.amount;
    const name = meta?.name;
    price = price?.sort(dt.lsort);
    const dates = price?.map(e => e.d);
    const priceData = price?.map(e => e.c);
    const avgData = priceData?.map((e, i) =>
        Math.avg(priceData?.slice(Math.max(0, i - num), i + 1)))
    let props = { priceData, avgData }
    if (addBollinger) {
        const priceTop = avgData?.map((e, i) => Math.std(priceData?.slice(i - num, i), 2))
        const priceBot = avgData?.map((e, i) => Math.std(priceData?.slice(i - num, i), -2))
        props = { ...props, priceTop, priceBot };
    }

    if (addEarn) {
        const epsData = price?.map(e => Math.round(e?.eps / amount));
        const bpsData = price?.map(e => Math.round(e?.bps / amount));
        props = { ...props, epsData, bpsData };
    }
    return props;
}

const PriceChart = ({
    price = [], meta = {},
    addEarn = true, addBollinger = false, N = 20, help = true,
    axis = true, legend = true,
}) => {
    const [num, setNum] = useState(N);
    const [options, setOptions] = useState(defaultOptions);
    useEffect(() => {
        refineData({
            price, meta, addEarn, addBollinger, num
        }).then(({ priceData, avgData, priceTop, priceBottom, bpsData, epsData }) => {
            setOptions({
                ...options,
                series: [{
                    data: priceData
                }, {
                    data: avgData
                }, {
                    data: priceTop
                }, {
                    data: priceBottom
                }, {
                    data: bpsData
                }, {
                    data: epsData
                }],
                plotOptions: {
                    legend: {
                        enabled: false
                    }
                }
            })
        })
    }, [])
    const props = {
        des: ' 도움말',
        data: <>{addBollinger &&
            <>
                <tr><th>%B</th><td>(현재가-하단가) / 밴드길이<br />낮을수록 상승가능성 높음</td></tr>
                <tr><th>%BW</th><td>밴드길이 / 현재가<br />낮을수록 가격변동성 높음</td></tr>
            </>
        }{addEarn &&
            <>
                <tr><th>BPS</th><td>(분기별 자본금) / (발행 주식)</td></tr>
                <tr><th>EPS</th><td>(초기자본 + 누적이익) / (발행 주식)</td></tr>
            </>}
        </>
    };
    return <div>
        {help && <Help {...props} />}
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    </div>
}

export default PriceChart;