import styles from '@/styles/Chart/Earn.module.scss';
import colors from '@/module/colors';
import dt from '@/module/dt';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import scss from '@/styles/variables.module.scss';
import { Int, parseFix } from '@/module/ba';
import { renderToStaticMarkup } from "react-dom/server"
import { useEffect, useRef, useState } from 'react';
import Help from '#/base/Help';
import '@/module/array';

const defaultOptions = (stockEarn) => {
    return {
        title: { text: '' },
        credits: { enabled: false },
        chart: {
            type: 'line',
            backgroundColor: null,
            margin: [0, 0, 0, 0],
        },
        xAxis: {
            enabled: true,
            crosshair: true,
            categories: stockEarn.map(e => e?.date),
            labels: {
                // allowOverlap: false,
                // autoRotation: stockEarn.map(e => 0),
                step: 4,
                style: {
                    color: scss?.textBright,
                    // textOverflow: 'none'
                },
                // formatter: function () {
                //     console.log(this);
                //     return this.value.slice(0, 4);
                // },
            }
        },
        yAxis: {
            visible: false,
        },
        legend: {
            enabled: false
        },
    }
}

const PriceChart = ({
    stockEarn = [], stockMeta = {}, help = true,
    axis = true, legend = true,
}) => {
    const amount = stockMeta?.a;
    const [equityOptions, setEquityOptions] = useState(defaultOptions(stockEarn));
    const [profitOptions, setProfitOptions] = useState(defaultOptions(stockEarn));
    useEffect(() => {
        // console.log('earn 차트 렌더링중')
        if (stockEarn) {
            stockEarn = stockEarn.sort(dt.lsort);
            setEquityOptions({
                ...equityOptions,
                series: [{
                    data: stockEarn.map(e => Int(e.equity / amount))
                }],
            })
            setProfitOptions({
                ...profitOptions,
                series: [{
                    data: stockEarn.map(e => Int(e.sum?.profit / amount))
                }],
            })
        }
    }, [stockMeta])
    const props = {
        des: ' 도움말', data: <>
            <tr><th>BPS</th><td>(분기별 자본금) / (발행 주식)</td></tr>
            <tr><th>EPS</th><td>(당기순이익) / (발행 주식)</td></tr>
        </>
    }
    return <div>
        <Help {...props} />
        <div className={styles.wrap}>
            <div className={styles.chart}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={equityOptions}
                />
            </div>
            <div className={styles.chart}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={profitOptions}
                />
            </div>
        </div>
    </div>
}

export default PriceChart;