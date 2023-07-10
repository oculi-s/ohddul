import '@/module/array';
import styles from '$/Chart/Share.module.scss';
import colors from '@/module/colors';
import { Div, parseFix } from '@/module/ba';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import scss from '$/variables.module.scss';
import { NameDict } from '#/stockData/stockShare';
import { useEffect, useState } from 'react';

const options = {
    spanGaps: true,
    maintainAspectRatio: false,
    animation: { duration: 200 },
    layout: {
        padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    },
    plugins: {
        datalabels: {
            useHTML: true,
            color: '#fff',
            textAlign: 'center',
            font: {
                size: 14,
            },
            display: 'auto',
            formatter: function (value, ctx) {
                const i = ctx?.dataIndex;
                const data = ctx?.chart?.data;
                const sum = data?.datasets[0].data?.sum();
                var label = data?.labels[i];
                label = NameDict[label] || label;
                return `${label}\n${Div(value, sum, 1)}`;
            }
        },
        legend: false,
        tooltip: {
            callbacks: {
                label: function (ctx) {
                    const v = ctx?.raw;
                    return v + '%';
                },
                title: function (ctx) {
                    const n = ctx[0]?.label;
                    return NameDict[n] || n;
                }
            }
        },
    },
}

const ShareDonut = ({ stockShare, stockMeta }) => {
    stockShare = stockShare?.data;
    const [data, setData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        if (stockShare?.length) {
            console.log('share 차트 렌더링중');
            const amount = stockMeta?.a;
            let res = amount - stockShare.map(e => e.amount).sum();
            res = Math.max(0, res);
            const shareData = stockShare.map(e => parseFix(e.amount / amount * 100, 1));
            const labels = stockShare.map(e => e.name);
            if (res > 1) {
                shareData.push(parseFix(res / amount * 100, 1));
                labels.push('데이터없음');
            }
            const len = shareData.length;
            const backgroundColor = [...colors.slice(0, len - 1), scss.bgDark];
            const data = {
                labels,
                datasets: [{
                    data: shareData,
                    backgroundColor,
                    borderWidth: 0
                }]
            };
            setData(data);
        }
    }, [stockShare]);

    return (
        <div className={styles.wrap}>
            {stockShare?.length ? <Doughnut
                data={data}
                options={options}
                plugins={[ChartDataLabels]}
            /> :
                <p>API에서 제공된<br />지분 데이터가 없습니다.</p>
            }
        </div>
    )
}

export default ShareDonut;