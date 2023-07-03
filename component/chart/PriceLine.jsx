import { useEffect, useState } from "react"
import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import Annotation from "chartjs-plugin-annotation";
import styles from '$/Chart/Price.module.scss';
import dt from "@/module/dt";
import { Line } from "react-chartjs-2";
import colors from "@/module/colors";
import scss from '$/variables.module.scss';
import toggleOnPageChange from "#/toggle";
import { useRouter } from "next/router";
import { maxPoint, minPoint } from "@/module/chart/annotations";
import { CheckBox, RadioSelect } from "#/base/InputSelector";
import merge from 'deepmerge';
import { hairline } from "@/module/chart/plugins";
import { parseFix } from "@/module/ba";
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

const plugins = [hairline, Annotation];

/**
 * 주의할 부분
 * 
 * priceRaw를 slice할 때 i+1-num 부터 i+1까지 해야함
 * 이유는 start부터 end-1까지 데이터를 구하기 때문
 */
async function getData({
    price, amount, isEarn, isBollinger, num, isMinMax, percentMa
}) {
    price = price?.sort(dt.lsort);
    const dates = price?.map(e => e.d);
    const priceRaw = price?.map(e => e.c);
    const priceAvg = dates?.map((e, i) => Math.avg(priceRaw?.slice(i + 1 - num, i + 1)));
    const priceTop = dates?.map((e, i) => Math.std(priceRaw?.slice(i + 1 - num, i + 1), 2))
    const priceBot = dates?.map((e, i) => Math.std(priceRaw?.slice(i + 1 - num, i + 1), -2))

    var props = { dates, priceRaw, priceAvg, priceTop, priceBot };
    var ymin = 2e9, ymax = -1;

    if (percentMa) {
        const priceMa = dates?.map((e, i) => {
            // if (!priceTop[i]) return 50;
            // if (!priceBot[i]) return 50;
            return (priceRaw[i] - priceBot[i]) / (priceTop[i] - priceBot[i]) * 100;
        })
        props = { ...props, priceMa };
    }

    if (isMinMax) {
        var mini = 0, maxi = 0, min = 2e9, max = -1;
        priceRaw?.forEach((e, i) => {
            if (e && e < min) mini = i, min = e;
            if (e && e > max) maxi = i, max = e;
            if (!e) priceRaw[i] = priceRaw[i - 1]
        })
        ymin = min, ymax = max;
        props = { ...props, mini, maxi, min, max };
    }

    if (isEarn) {
        const stockEps = price?.map(e => {
            const v = Math.round(e?.eps / amount)
            if (v && v < ymin) ymin = v;
            if (v && v > ymax) ymax = v;
            return v;
        });
        const stockBps = price?.map(e => {
            const v = Math.round(e?.bps / amount)
            if (v && v < ymin) ymin = v;
            if (v && v > ymax) ymax = v;
            return v;
        });
        props = { ...props, stockEps, stockBps };
    }
    return { ...props, ymin, ymax };
}

/**
 * 계산된 차트 데이터를 정제하여 차트에 입힐 수 있도록 만드는 함수
 * 
 * 이평을 계산할 때 num보다 작은 데이터에서 이평 계산이 안되어 잘리는 걸 같이 잘라주었다가
 * 6개월 데이터 120이평에서 데이터가 너무 표시가 안돼서 slice를 2023.06.30 폐기
 */
async function refineData({
    prices, metas, num, isEarn, isBollinger, isMinMax, percentMa
}) {
    let mainData = [], date, options = {};
    let subData = [], suboptions = {};
    const k = prices?.length;
    for await (let i of Array(k).keys()) {
        const price = prices[i];
        const amount = metas[i]?.a;
        const last = price?.find(() => true);
        const {
            dates,
            priceRaw, priceAvg,
            priceTop, priceBot,
            stockEps, stockBps,
            priceMa,
            min, mini, max, maxi,
            ymin, ymax,
        } = await getData({
            price, amount,
            isEarn, isBollinger,
            num, isMinMax, percentMa
        });
        date = dates//?.slice(num);
        mainData = [...mainData, {
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
            mainData = [...mainData, {
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
            mainData = [...mainData, {
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
        if (isMinMax) {
            options.plugins = {
                annotation: {
                    annotations: [
                        {
                            type: 'line', yMin: max, yMax: max,
                            borderColor: scss?.redDark,
                            borderWidth: .5,
                        }, {
                            type: 'line',
                            yMin: min, yMax: min,
                            borderColor: scss?.blueDark,
                            borderWidth: .5,
                        },
                        maxPoint({ i: maxi, max, last: last?.c, len: price?.length }),
                        minPoint({ i: mini, min, last: last?.c, len: price?.length }),
                    ]
                }
            }
            options.scales = {
                y: { min: ymin * 0.9, max: ymax * 1.1 }
            };
        }
        if (percentMa) {
            const def = { borderWidth: 1, pointRadius: 0 }
            subData = [...subData, {
                data: priceMa,
                label: '%B',
                borderColor: scss?.bgBrighter,
                backgroundColor: scss?.bgBrighter,
                ...def
            }]
            suboptions.scales = {
                y: { min: -20, max: 120, display: true }
            }
            suboptions.plugins = {
                annotation: {
                    annotations: [{
                        type: 'line',
                        yMin: 50, yMax: 50,
                        borderColor: scss.bgBrighter,
                        borderWidth: 1,
                    }, {
                        type: 'box',
                        yMin: 0, yMax: 100,
                        borderColor: scss.bgBrighter,
                        backgroundColor: scss.bgOpacity,
                        borderDash: [5, 5],
                        borderWidth: 1,
                    }]
                },
                tooltip: {
                    callbacks: {
                        label: function (ctx, data) {
                            return `${ctx?.dataset?.label} ${parseFix(ctx?.raw)}%`;
                        },
                    }
                }
            }
        }
    }
    return [
        { labels: date, datasets: mainData },
        { labels: date, datasets: subData },
        options, suboptions
    ];
}

function ButtonGroup({
    isBollinger, setBollinger,
    isEarn, setEarn,
    isMinMax, setMinMax,
    len, setLen, num, setNum,
    bollingerBtn, timeBtn
}) {
    const router = useRouter();
    const [view, setView] = useState(false);
    toggleOnPageChange(router, setView);
    if (!timeBtn && !bollingerBtn) return;
    return <>
        <div className={`${styles.navWrap} ${view ? styles.view : ''}`}>
            <div className={`${styles.nav}`}>
                {(timeBtn || bollingerBtn) &&
                    <>
                        <div className={styles.checkGroup}>
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
                        </div>
                        <div className={styles.checkGroup}>
                            <p><CheckBox
                                name={'최대최소'}
                                onChange={setMinMax}
                                defaultChecked={isMinMax}
                            /></p>
                        </div>
                    </>
                }
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
            <button
                onClick={e => setView(e => !e)}
                className={`fa fa-chevron-down ${styles.toggleBtn} ${view ? styles.view : ''}`}
            />
        </div>
    </>
}

const YEAR_LEN = 252;
function PriceLine({
    prices = [{}], metas = [{}],
    addEarn = true, addBollinger = false, minMax = true,
    N = 60, L = YEAR_LEN * 5,
    percentMa = true,
    bollingerBtn = true, timeBtn = true,
    x = false, y = false, legend = false,
}) {
    defaultOptions.plugins.legend.display = legend;
    defaultOptions.scales.x.display = x;
    defaultOptions.scales.y.display = y;

    const [num, setNum] = useState(N);
    const [len, setLen] = useState(L);
    const [isEarn, setEarn] = useState(addEarn);
    const [isMinMax, setMinMax] = useState(minMax);
    const [isBollinger, setBollinger] = useState(addBollinger);
    const [options, setOptions] = useState(defaultOptions);
    const [suboptions, setSubOptions] = useState(defaultOptions);
    prices = prices.map(price => price?.sort(dt.sort)?.slice(0, len));

    const [data, setData] = useState({ labels: [], datasets: [] });
    const [subData, setSubData] = useState({ labels: [], datasets: [] });
    useEffect(() => {
        console.log('price 차트 렌더링중');
        refineData({
            prices, metas, num, isEarn, isBollinger, isMinMax, percentMa
        }).then(([data, sub, option, suboption]) => {
            setData(data);
            setSubData(sub);
            setOptions(merge(defaultOptions, option))
            setSubOptions(merge(defaultOptions, suboption));
        })
    }, [metas, isEarn, isBollinger, isMinMax, num, len])
    const props = {
        isBollinger, setBollinger,
        isEarn, setEarn,
        isMinMax, setMinMax,
        len, setLen, num, setNum,
        bollingerBtn, timeBtn
    }
    return (<>
        <div className={`${styles.wrap} ${percentMa && styles.withSub}`}>
            <ButtonGroup {...props} />
            <div className={styles.chart}>
                <Line
                    options={options}
                    plugins={plugins}
                    data={data}
                />
            </div>
            {percentMa &&
                <div className={`${styles.chart} ${styles.sub}`}>
                    <Line
                        options={suboptions}
                        plugins={plugins}
                        data={subData}
                    />
                </div>
            }
        </div >
    </>)
}

export default PriceLine;