import styles from '@/styles/Chart/Share.module.scss';
import colors from '@/module/colors';
import { Fix } from '@/module/ba';
import 'chartjs-plugin-labels'
import { Doughnut } from 'react-chartjs-2';

const ShareChart = ({ stockShare: share, stockMeta }) => {
    if (!share?.length) {
        return (
            <div style={{ textAlign: "center" }}>
                <div className={styles.wrap}>
                    <p>openDart에서 제공된<br />지분 데이터가 없습니다.</p>
                </div>
            </div>
        )
    }
    const amount = stockMeta?.amount;
    let res = amount - share.map(e => e.amount).reduce((a, b) => a + b, 0);
    res = Math.max(0, res);
    const shareData = share.map(e => Fix(e.amount / amount * 100, 1));
    const labels = share.map(e => e.name);
    shareData.push(Fix(res / amount * 100, 1));
    labels.push('데이터없음');

    const options = {
        spanGaps: true,
        maintainAspectRatio: false,
        plugins: {
            labels: {
                render: 'percentage',
                fontColor: 'white'
            },
            legend: {
                display: false
            },
        }
    }
    const data = {
        labels,
        datasets: [{
            data: shareData,
            backgroundColor: colors,
            borderWidth: 0
        }]
    }

    return (
        <div className={styles.wrap}>
            <Doughnut data={data} options={options} />
        </div>
    )
}

export default ShareChart;