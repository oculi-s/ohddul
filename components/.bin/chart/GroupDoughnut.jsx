import '@/module/array';
import styles from '$/Chart/Share.module.scss';
import colors from '@/module/colors';
import { Div, Fix, Price } from '@/module/ba';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/router';


const GroupDoughnutChart = ({ group, name, meta, price }) => {
    const router = useRouter();
    const options = {
        spanGaps: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    const i = ctx?.dataIndex;
                    const data = ctx?.chart?.data;
                    const label = data?.labels[i];
                    return `${label}\n${Price(value)}`;
                },
                color: '#fff',
                textAlign: 'center',
                font: {
                    size: 16,
                },
                display: 'auto'
            },
            legend: false,
            tooltip: {
            }
        }
    }

    group = group[name];
    const groupPrice = group?.child
        ?.map(e => { return { code: e, price: meta.data[e]?.amount * price[e]?.close } })
        ?.sort((b, a) => a.price - b.price);

    const labels = groupPrice.map(({ code }) => meta.data[code]?.name);
    const data = {
        labels,
        datasets: [{
            data: groupPrice.map(e => e.price),
            backgroundColor: colors,
            borderWidth: 0,
        }]
    };
    return <div className={styles.wrap}>
        <Doughnut data={data} options={options} redraw={false} plugins={[ChartDataLabels]} />
    </div>
}

export default GroupDoughnutChart;