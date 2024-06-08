import scss from '$/variables.module.scss';
import '@/module/array';
import colors from '@/module/colors';
import { ChartData } from 'chart.js';
import { PriceCloseDailyType } from '../type/stock';

/**
 * 주의할 부분
 * 
 * priceRaw를 slice할 때 i+1-num 부터 i+1까지 해야함
 * 이유는 start부터 end-1까지 데이터를 구하기 때문
 * 2023.07.18 데이터를 미리 계산해 저장해두면서 폐기
 */
export function getData({
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
export async function refineData({
    data, num, isBollinger
}: {
    data: PriceCloseDailyType[],
    num: number,
    isBollinger: boolean
}): Promise<ChartData<'line'>[]> {
    let mainData = [], date;
    date = data?.map(e => e?.d);
    var mini = -1, maxi = -1, min, max;
    for await (let [i, e] of data?.entries()) {
        if (!e?.c && data[i - 1]?.c && data[i + 1]?.c) {
            data[i].c = data[i - 1].c;
        }
        const c = e.c;
        if (mini == -1) mini = i, min = c;
        else if (c < min) mini = i, min = c;
        if (maxi == -1) maxi = i, max = c;
        else if (c > max) maxi = i, max = c;
    }
    let {
        priceAvg, priceTop, priceBot, priceRaw
    } = getData({ data, num });
    if (isBollinger) {
        priceRaw = priceRaw?.slice(60);
        priceAvg = priceAvg?.slice(60);
        priceTop = priceTop?.slice(60);
        priceBot = priceBot?.slice(60);
        date = date?.slice(60);
    }
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
    }, {
        data: priceTop, label: "BB상단",
        borderColor: scss?.red,
        backgroundColor: scss?.red,
        borderWidth: 1,
        pointRadius: 0,
    }, {
        data: priceBot, label: "BB하단",
        borderColor: scss?.blue,
        backgroundColor: scss?.blue,
        borderWidth: 1,
        pointRadius: 0,
    }]
    return [
        { labels: date, datasets: mainData },
    ];
}