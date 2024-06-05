import '@/module/array';
import styles from '$/Chart/Share.module.scss';
import colors from '@/module/colors';
import { Div, parseFix } from '@/module/ba';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import scss from '$/variables.module.scss';
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
                    return n;
                }
            }
        },
    },
}

const ShareDonut = ({ share, meta }) => {
    const [data, setData] = useState({ labels: [], datasets: [] });
    useEffect(() => {
        if (share?.length) {
            console.time('share');
            const total = meta?.a;
            share = share.filter(e => e.amount / total * 100 > 0.1);
            const shareData = share
                ?.map(e => parseFix(e.amount / total * 100, 1))
            const labels = share.map(e => e.name);
            const len = shareData.length;
            let backgroundColor = colors.slice(0, len);
            let res = total - share.map(e => e.amount).sum();
            res = Math.max(0, res);
            if (res > 1) {
                shareData.push(parseFix(res / total * 100, 1));
                labels.push('데이터없음');
                backgroundColor = [...colors.slice(0, len), scss.bgDark];
            }
            const data = {
                labels,
                datasets: [{
                    data: shareData,
                    backgroundColor,
                    borderWidth: 0
                }]
            };
            setData(data);
            console.timeEnd('share')
        }
    }, [share]);

    return (
        <div className={styles.wrap}>
            {share?.length ? <Doughnut
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