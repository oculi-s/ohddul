import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import Annotation from "chartjs-plugin-annotation";
import styles from '@/styles/Chart/Price.module.scss';
import dt from "@/module/dt";
import { Line } from "react-chartjs-2";
import colors from "@/module/colors";
import scss from '@/styles/variables.module.scss';
import toggleOnPageChange from "#/toggle";
import { useRouter } from "next/router";
import { maxPoint, minPoint } from "./annotations";
import { CheckBox, RadioSelect } from "#/base/InputSelector";
import '@/module/array'
Chart.register(Annotation);

/**
 * tooltip custom 하는 방법
 * 
 * interaction : hover에서 
 */
const defaultOptions = {
    plugins: {
        tooltip: {
            callbacks: {
                // title: function (tooltipItem, data) {
                //     return dt.toString(tooltipItem[0]?.label);
                // },
                // label: function (tooltipItem, data) {
                //     return data;
                // },
                // afterLabel: function (tooltipItem, data) {
                //     let percent = 1;
                //     return '(' + percent + '%)';
                // }
            },
        },
        legend: {},
        annotation: {
            drawTime: 'afterDatasetsDraw',
        },
    },
    animation: {
        x: { duration: 0, from: 1000 },
        y: { duration: 300 }
    },
    interaction: { intersect: false, mode: 'index', },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: { x: {}, y: {} }
}

const plugins = [{
    afterDraw: chart => {
        if (chart.tooltip?._active?.length) {
            let x = chart.tooltip._active[0].element.x;
            let yAxis = chart.scales.y;
            let ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 1;
            ctx.strokeStyle = colors[0];
            ctx.stroke();
            ctx.restore();
        }
    }
}, Annotation];

async function getData({
    price, amount, isEarn, isBollinger, num, minMax
}) {
    price = price?.sort(dt.lsort);
    const dates = price?.map(e => e.d);
    const priceRaw = price?.map(e => e.c);
    const priceAvg = priceRaw?.map((e, i) => Math.avg(priceRaw?.slice(i - num, i)))
    let props = { dates, priceRaw, priceAvg };

    if (minMax) {
        var mini = 0, maxi = 0, min = 2e9, max = -1;
        priceRaw?.forEach((e, i) => {
            if (e < min) mini = i, min = e;
            if (e > max) maxi = i, max = e;
        })
        props = { ...props, mini, maxi, min, max };
    }

    if (isBollinger) {
        const priceTop = priceAvg?.map((e, i) => Math.std(priceRaw?.slice(i - num, i), 2))
        const priceBot = priceAvg?.map((e, i) => Math.std(priceRaw?.slice(i - num, i), -2))
        props = { ...props, priceTop, priceBot };
    }

    if (isEarn) {
        const stockEps = price?.map(e => Math.round(e?.eps / amount));
        const stockBps = price?.map(e => Math.round(e?.bps / amount));
        props = { ...props, stockEps, stockBps };
    }
    return props;
}

/**
 * 계산된 차트 데이터를 정제하여 차트에 입힐 수 있도록 만드는 함수
 * 
 * 이평을 계산할 때 num보다 작은 데이터에서 이평 계산이 안되어 잘리는 걸 같이 잘라주었다가
 * 6개월 데이터 120이평에서 데이터가 너무 표시가 안돼서 slice를 2023.06.30 폐기
 */
async function refineData({
    prices, metas, isEarn, isBollinger, num, minMax
}) {
    let datasets = [], date, options = {};
    const k = prices?.length;
    for await (let i of Array(k).keys()) {
        const price = prices[i];
        const amount = metas[i]?.a;
        const last = price[0];
        const {
            dates,
            priceRaw, priceAvg,
            priceTop, priceBot,
            stockEps, stockBps,
            min, mini, max, maxi,
        } = await getData({
            price, amount,
            isEarn, isBollinger,
            num, minMax
        });
        date = dates//?.slice(num);
        datasets = [...datasets, {
            data: priceRaw,//?.slice(num),
            label: '종가',
            borderColor: 'gray',
            borderWidth: 1,
            pointRadius: 0
        }, {
            data: priceAvg,//?.slice(num),
            label: `${num}일 이평`,
            fill: false,
            borderColor: colors[i],
            backgroundColor: colors[i],
            borderWidth: 1.5,
            pointRadius: 0
        }];
        if (isEarn) {
            const def = { borderWidth: 2, pointRadius: 0 }
            datasets = [...datasets, {
                data: stockEps,//?.slice(num),
                label: "EPS",
                borderColor: scss?.red,
                backgroundColor: scss?.red,
                ...def
            }, {
                data: stockBps,//?.slice(num),
                label: "BPS",
                borderColor: scss?.blue,
                backgroundColor: scss?.blue,
                ...def
            }];
        }
        if (isBollinger) {
            const def = { borderWidth: 1, pointRadius: 0 }
            datasets = [...datasets, {
                data: priceTop,//?.slice(num),
                label: "BB상단",
                borderColor: scss?.red,
                backgroundColor: scss?.red,
                ...def
            }, {
                data: priceBot,//?.slice(num),
                label: "BB하단",
                borderColor: scss?.blue,
                backgroundColor: scss?.blue,
                ...def
            }]
        }
        if (minMax) {
            options.plugins = {
                annotation: {
                    annotations: {
                        max: maxPoint({ i: maxi, max, last: last.c, len: price?.length }),
                        min: minPoint({ i: mini, min, last: last.c, len: price?.length }),
                    }
                }
            }
            options.scales = {
                y: { min: min * 0.6, max: max * 1.1 }
            };
        }
    }
    return [{ labels: date, datasets }, options];
}

function ButtonGroup({
    view, setView,
    isBollinger, setBollinger,
    isEarn, setEarn,
    len, setLen, num, setNum,
    bollingerBtn, timeBtn
}) {
    return <div className={`${styles.buttonWrap} ${view ? styles.view : ''}`}>
        <div>
            <div className={`${styles.buttonGroup}`}>
                {(timeBtn || bollingerBtn) && <div>
                    <p><CheckBox
                        name={'BB추가'}
                        onChange={setBollinger}
                        defaultChecked={isBollinger}
                    /></p>
                    <p><CheckBox
                        name={'실적차트'}
                        onChange={setEarn}
                        defaultChecked={isEarn}
                    /></p>
                </div>}
                {timeBtn && <RadioSelect
                    title={'기간'}
                    names={['6M', '1Y', '5Y']}
                    values={[YEAR_LEN / 2, YEAR_LEN, YEAR_LEN * 5]}
                    onChange={setLen}
                    defaultValue={len}
                />}
                {bollingerBtn && <RadioSelect
                    title={'이평'}
                    names={['20', '60', '120']}
                    values={[20, 60, 120]}
                    onChange={setNum}
                    defaultValue={num}
                />}
            </div>
        </div>
    </div>
}

const YEAR_LEN = 252;
function PriceLine({
    prices = [{}], metas = [{}],
    addEarn = true, addBollinger = false, N = 60, L = YEAR_LEN * 5,
    bollingerBtn = true, timeBtn = true, minMax = true,
    x = false, y = false, legend = false,
}) {
    defaultOptions.plugins.legend.display = legend;
    defaultOptions.scales.x.display = x;
    defaultOptions.scales.y.display = y;

    const [num, setNum] = useState(N);
    const [len, setLen] = useState(L);
    const [view, setView] = useState(false);
    const [isEarn, setEarn] = useState(addEarn);
    const [isBollinger, setBollinger] = useState(addBollinger);
    const [options, setOptions] = useState(defaultOptions);
    const router = useRouter();
    prices = prices.map(price => price?.sort(dt.sort)?.slice(0, len));
    toggleOnPageChange(router, setView);
    // toggleOnPageChange(router, setLen, 5 * 252);

    // const []
    const [data, setData] = useState({ labels: [], datasets: [] });
    const [subData, setSubData] = useState({ labels: [], datasets: [] });
    useEffect(() => {
        console.log('price 차트 렌더링중');
        refineData({
            prices, metas, isEarn, isBollinger, num, minMax
        }).then(([data, option]) => {
            setData(data);
            setOptions(options.deepMerge(option))
        })
    }, [metas, isEarn, isBollinger, num, len])
    const props = {
        view, setView,
        isBollinger, setBollinger,
        isEarn, setEarn,
        len, setLen, num, setNum,
        bollingerBtn, timeBtn
    }
    return (<>
        <div className={styles.wrap}>
            <ButtonGroup {...props} />
            <button
                onClick={e => setView(e => !e)}
                className={`fa fa-chevron-right 
                ${styles.toggleBtn} 
                ${view ? styles.view : ''}
                `}
            />
            <div className={styles.chart}>
                <Line
                    options={options}
                    plugins={plugins}
                    data={data}
                />
                {/* 2023.06.30 %BB 서브차트 추가해야함 */}
                {/* {isBollinger && <Line
                    options={options}
                    plugins={plugins}
                    data={data}
                />} */}
            </div>
        </div >
    </>)
}

export default PriceLine;