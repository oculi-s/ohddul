import colors from '@/module/colors';
import dt from '@/module/dt';
import styles from '@/styles/Index.module.scss';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import scss from '@/styles/variables.module.scss';
import '@/module/array';
import { parseFix } from '@/module/ba';

var stockData = []

const groupColors = {
    삼성: '#034ea2',
    SK: '#ea002c',
    LG: '#a50034',
    현대차: '#002c5f',
    POSCO: '#05507d',
}

const Group = ({ group, price, meta }) => {
    meta = meta.data;
    const total = Object.values(group).map(e => e.price).sum() / 100;
    const lastDate = dt.parse(group.last);
    const data = Object.values(group)
        ?.slice(0, 5)
        ?.map((e, i) => {
            e.child = e.child?.sort((b, a) =>
                meta[a]?.amount * price[a]?.close - meta[b]?.amount * price[b]?.close);
            const name = e.name;
            const children = e.child.map(code => meta[code]?.name);
            const prices = e.child.map(code => {
                const amount = meta[code]?.amount;
                const close = price[code]?.close;
                return parseFix(amount * close / total, 2);
            });
            return {
                name,
                y: parseFix(e.price / total, 2),
                color: groupColors[name] || colors[i],
                drilldown: {
                    name, children, prices
                },
            }
        });
    data.sort((b, a) => a.y - b.y);
    for (let sub of data) {
        const len = sub.drilldown.prices.length;
        for (let j = 0; j < len; j++) {
            let brightness = 0.1 - (j / len) / 5;
            stockData.push({
                name: sub.drilldown.children[j],
                y: sub.drilldown.prices[j],
                color: Highcharts.color(sub.color).brighten(brightness).get()
            });
        }
    }
    const options = {};
    Highcharts.setOptions({
        chart: {
            type: 'pie',
            backgroundColor: null,
            height: 500
        },
        title: { text: '' },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%'],
                borderWidth: 0
            }
        },
        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            data,
            size: '60%',
            dataLabels: {
                format: `<div><a href=/group/{point.name} style="color:${scss.anchorBright}">{point.name}</a><br><p style="opacity: 0.5;font-size:12px;">{y}%</p></div>`,
                color: '#ffffff',
                distance: -30,
                style: {
                    fontSize: 16,
                }
            }
        }, {
            data: stockData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                format: `<a href=/stock/{point.name} style="color:${scss.anchor}"><b>{point.name}</b></a><br> <span style="opacity: 0.5">{y}%</span>`,
                filter: {
                    property: 'y',
                    operator: '>',
                    value: 1
                },
                style: {
                    fontWeight: 'normal',
                    fontSize: 14
                }
            },
            id: 'versions'
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    series: [{
                    }, {
                        id: 'versions',
                        dataLabels: {
                            enabled: false
                        }
                    }]
                }
            }]
        }
    })

    return <>
        <div className={`${styles.area} ${styles.groupArea}`}>
            <h3>그룹사 시가총액 순위</h3>
            <div className={styles.chart}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
            <p className='des'>기준일 : {lastDate}</p>
        </div>
    </>
}

export default Group;