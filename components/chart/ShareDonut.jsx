import scss from '$/variables.module.scss';
import '@/module/array';
import { parseFix } from '@/module/ba';
import colors from '@/module/colors';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

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
                size: 16,
                family: 'NanumSquare',
            },
            display: 'auto',
            formatter: function (value, ctx) {
                const i = ctx?.dataIndex;
                const data = ctx?.chart?.data;
                var label = data?.labels[i];
                return `${label}\n${value}%`;
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
        <div className='w-full h-full justify-center items-center flex p-10'>
            {share?.length ? <Doughnut
                data={data}
                options={options}
                plugins={[ChartDataLabels]}
            /> :
                <div>API에서 제공된<br />지분 데이터가 없습니다.</div>
            }
        </div>
    )
}

export default ShareDonut;