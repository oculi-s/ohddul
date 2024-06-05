import scss from '$/variables.module.scss';
import { Loading } from "@/components/base/base";
import '@/module/array';
import { hairline } from "@/module/chart/plugins";
import colors from "@/module/colors";
import dt from "@/module/dt";
import { Chart } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import Annotation from "chartjs-plugin-annotation";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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

const plugins = [hairline, Annotation];

/**
 * 주의할 부분
 * 
 * priceRaw를 slice할 때 i+1-num 부터 i+1까지 해야함
 * 이유는 start부터 end-1까지 데이터를 구하기 때문
 * 2023.07.18 데이터를 미리 계산해 저장해두면서 폐기
 */
function getData({
    data, num
}) {
    const dates = data?.map(e => e.d);
    const priceRaw = data?.map(e => e.c);
    const priceAvg = dates?.map((e, i) => Math.avg(priceRaw?.slice(i + 1 - num, i + 1)));
    const priceTop = dates?.map((e, i) => Math.std(priceRaw?.slice(i + 1 - num, i + 1), 2))
    const priceBot = dates?.map((e, i) => Math.std(priceRaw?.slice(i + 1 - num, i + 1), -2))
    var props = { priceRaw, priceAvg, priceTop, priceBot };
    return { ...props };
}

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
    data, num, isBollinger
}) {
    let mainData = [], date;
    date = data?.map(e => e?.d);
    var mini = -1, maxi = -1, min, max;
    for (let [i, e] of data?.entries()) {
        if (!e?.c && data[i - 1]?.c && data[i + 1]?.c) {
            data[i].c = data[i - 1].c;
        }
        const c = e.c;
        if (mini == -1) mini = i, min = c;
        else if (c < min) mini = i, min = c;
        if (maxi == -1) maxi = i, max = c;
        else if (c > max) maxi = i, max = c;
    }
    const {
        priceAvg, priceTop, priceBot, priceRaw
    } = getData({ data, num });
    mainData = [...mainData, {
        data: priceRaw, label: '종가',
        borderColor: 'gray',
        borderWidth: 1,
        pointRadius: 0,
    }, {
        data: priceAvg, label: `${num}일 이평`,
        borderColor: colors[0],
        backgroundColor: colors[0],
        borderWidth: 1.5,
        pointRadius: 0,
    }];
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
    return [
        { labels: date, datasets: mainData },
    ];
}

function IndexLine({
    data = [], load,
    x = false, y = false,
}) {
    data.sort(dt.lsort);
    defaultOptions.scales.x.display = x;
    defaultOptions.scales.y.display = y;

    const [options, setOptions] = useState(defaultOptions);
    const [chart, setData] = useState({ labels: [], datasets: [] });
    useEffect(() => {
        if (!load?.price) {
            console.time('index');
            const [chart, option] = refineData({
                data, num: 60,
                isBollinger: true,
            })
            setData(chart);
            console.timeEnd('index');
        } else {
            setData({ labels: [], datasets: [] })
        }
    }, [load?.price])

    return (
        load?.price
            ? <Loading left={"auto"} right={"auto"} />
            : <Line
                options={options}
                plugins={plugins}
                data={chart}
            />
    )
}

export default IndexLine;