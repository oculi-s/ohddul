import { useEffect, useState } from "react"
import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import Annotation from "chartjs-plugin-annotation";
import deepmerge from 'deepmerge';
import styles from '$/Chart/Price.module.scss';
import dt from "@/module/dt";
import { Line } from "react-chartjs-2";
import colors from "@/module/colors";
import scss from '$/variables.module.scss';
import { maxPoint, minPoint } from "@/module/chart/annotations";
import { CheckBox, RadioSelect } from "#/base/InputSelector";
import { hairline } from "@/module/chart/plugins";
import { H2R, parseFix } from "@/module/ba";
import { Loading } from "#/base/base";
import '@/module/array'
Chart.register(Annotation);

/**
 * tooltip custom 하는 방법
 * 
 * interaction : hover에서 
 */
const defaultOptions = {
    plugins: {
        legend: { display: false },
        annotation: {
            drawTime: 'afterDatasetsDraw',
        },
    },
    animation: {
        x: { duration: 0 },
        duration: 100
    },
    interaction: { intersect: false, mode: 'index', },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: "time",
            time: {
                tooltipFormat: "yyyy-MM-dd"

            }
        }, y: {}
    }
}

const suboption = {
    animation: {
        x: { duration: 0 },
        duration: 100
    },
    interaction: { intersect: false, mode: 'index', },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: "time",
            time: { tooltipFormat: "yyyy-MM-dd" },
            display: false,
        },
        y: { min: -20, max: 120, display: true }
    },
    plugins: {
        legend: { display: false },
        annotation: {
            drawTime: 'afterDatasetsDraw',
            annotations: [{
                type: 'line',
                yMin: 50, yMax: 50,
                borderColor: scss.bgBrighter,
                borderWidth: 1,
            }, {
                type: 'box',
                yMin: 0, yMax: 100,
                borderColor: scss.bgBrighter,
                backgroundColor: H2R(scss.bgBright, .3),
                borderDash: [5, 5],
                borderWidth: 1,
            }]
        },
        tooltip: {
            callbacks: {
                label: function (ctx) {
                    return `${ctx?.dataset?.label} ${parseFix(ctx?.raw)}%`;
                },
            }
        }
    }
}

const plugins = [hairline, Annotation];

/**
 * 계산된 차트 데이터를 정제하여 차트에 입힐 수 있도록 만드는 함수
 * 
 * 이평을 계산할 때 num보다 작은 데이터에서 이평 계산이 안되어 잘리는 걸 같이 잘라주었다가
 * 6개월 데이터 120이평에서 데이터가 너무 표시가 안돼서 slice를 2023.06.30 폐기
 * 
 * 20, 60, 120을 미리 만들어서 렌더하는 것으로 수정
 * 시간절약 : 4~6ms -> 1ms 미만
 */
function refineData({
    prices, num, isEarn, isBollinger, isMinMax, percentMa, from
}) {
    let mainData = [], date, options = {};
    let subData = [];
    for (let i of prices.keys()) {
        const price = prices[i];
        const raw = price?.priceRaw?.data;
        if (!price[num] || !raw) continue;
        date = raw?.map(e => e?.d);
        const priceRaw = raw?.map(e => e?.c);
        const last = priceRaw.slice(-1).find(e => true);
        const start = Math.max(from, new Date(date[0]));
        const size = raw.length;
        var mini = -1, maxi = -1, min, max, len = 0;
        for (let [i, e] of raw.entries()) {
            if (new Date(e.d) > from) {
                const c = e.c;
                if (mini == -1) mini = i, min = c;
                else if (c < min) mini = i, min = c;
                if (maxi == -1) maxi = i, max = c;
                else if (c > max) maxi = i, max = c;
                len++;
            }
        }
        const {
            priceAvg, priceTop, priceBot, stockEps, stockBps, priceMa,
        } = price[num];
        mainData = [...mainData, {
            data: priceRaw, label: '종가',
            borderColor: 'gray',
            borderWidth: 1,
            pointRadius: 0,
        }, {
            data: priceAvg, label: `${num}일 이평`,
            borderColor: colors[i],
            backgroundColor: colors[i],
            borderWidth: 1.5,
            pointRadius: 0,
        }];
        if (isEarn) {
            const def = { borderWidth: 2, pointRadius: 0 }
            mainData = [...mainData, {
                data: stockEps, label: "EPS",
                borderColor: scss?.red,
                backgroundColor: scss?.red,
                ...def
            }, {
                data: stockBps, label: "BPS",
                borderColor: scss?.blue,
                backgroundColor: scss?.blue,
                ...def
            }];
        }
        if (isBollinger) {
            const def = { borderWidth: 1, pointRadius: 0 }
            mainData = [...mainData, {
                data: priceTop, label: "BB상단",
                borderColor: scss?.red,
                backgroundColor: scss?.red,
                ...def
            }, {
                data: priceBot, label: "BB하단",
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
                            type: 'line',
                            yMin: max, yMax: max,
                            borderColor: scss?.redDark,
                            borderWidth: .5,
                        }, {
                            type: 'line',
                            yMin: min, yMax: min,
                            borderColor: scss?.blueDark,
                            borderWidth: .5,
                        },
                        maxPoint({ i: maxi, d: date[maxi], max, last, left: (maxi - size + len) * 2 <= len }),
                        minPoint({ i: mini, d: date[mini], min, last, left: (mini - size + len) * 2 <= len }),
                    ]
                }
            }
        }
        options.scales = { x: { min: start } };
        if (percentMa) {
            subData = [{
                data: priceMa,
                label: '%B',
                borderColor: scss?.bgBrighter,
                backgroundColor: scss?.bgBrighter,
                borderWidth: 1, pointRadius: 0
            }]
        }
    }
    return [
        { labels: date, datasets: mainData },
        { labels: date, datasets: subData },
        options
    ];
}

function ButtonGroup({
    isBollinger, setBollinger,
    isEarn, setEarn,
    isMinMax, setMinMax,
    len, setLen, num, setNum,
    bollingerBtn, timeBtn,
    view, setView,
}) {
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
                    values={[dt.YEAR / 2, dt.YEAR, dt.YEAR * 5]}
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
                onClick={() => setView(e => !e)}
                className={`fa fa-chevron-down ${styles.toggleBtn} ${view ? styles.view : ''}`}
            />
        </div>
    </>
}

function PriceLine({
    prices = [{}], load,
    addEarn = true, addBollinger = false, minMax = true,
    N = 60, L = dt.YEAR * 5,
    percentMa = true,
    bollingerBtn = true, timeBtn = true,
    x = false, y = false,
}) {
    defaultOptions.scales.x.display = x;
    defaultOptions.scales.y.display = y;

    const [len, setLen] = useState(L);
    const from = dt.num() - len;
    const [num, setNum] = useState(N);
    const [isEarn, setEarn] = useState(addEarn);
    const [isMinMax, setMinMax] = useState(minMax);
    const [isBollinger, setBollinger] = useState(addBollinger);
    const [options, setOptions] = useState(defaultOptions);
    const [suboptions, setSuboptions] = useState(suboption);

    const [view, setView] = useState(false);
    const [data, setData] = useState({ labels: [], datasets: [] });
    const [subData, setSubData] = useState({ labels: [], datasets: [] });
    useEffect(() => {
        setData({ labels: [], datasets: [] })
        setView(false);
    }, [prices])

    // 20, 60, 120을 async로 미리 만들어 놓고, 그때그때 minmax만 따로 구해줘야함
    useEffect(() => {
        if (!load?.price) {
            console.time('price');
            const [data, sub, option] = refineData({
                prices, num,
                isEarn, isBollinger, isMinMax,
                percentMa, from
            })
            const suboptions = {};
            suboptions.scales = option.scales;
            setData(data);
            setSubData(sub);
            setOptions(deepmerge(defaultOptions, option));
            setSuboptions(deepmerge(suboption, suboptions));
            console.timeEnd('price');
        }
    }, [load?.price, isEarn, isBollinger, isMinMax, num, len, prices])

    const props = {
        isBollinger, setBollinger,
        isEarn, setEarn,
        isMinMax, setMinMax,
        from, len, setLen, num, setNum,
        bollingerBtn, timeBtn,
        view, setView
    }


    return (<>
        <div className={`${styles.wrap} ${percentMa ? styles.withSub : ""} ${timeBtn || bollingerBtn ? styles.withBtn : ""}`}>
            {timeBtn || bollingerBtn ? <ButtonGroup {...props} /> : ""}
            <div className={styles.chart}>
                {load?.price
                    ? <Loading left={"auto"} right={"auto"} />
                    : <Line
                        plugins={plugins}
                        data={data}
                        options={options}
                    />}
            </div>
            {percentMa &&
                <div className={`${styles.chart} ${styles.sub}`}>
                    {load?.price
                        ? <Loading left={"auto"} right={"auto"} />
                        : <Line
                            plugins={plugins}
                            data={subData}
                            options={suboptions}
                        />}
                </div>}
        </div >
    </>)
}

export default PriceLine;