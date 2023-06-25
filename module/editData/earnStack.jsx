import { Int } from "@/module/ba";
import dt from "@/module/dt";

const years = [...Array(10).keys()].map(x => dt.toJson().Y - x).sort();
const types = { 3: '-03-31', 2: '-06-30', 4: '-09-30', 1: '-12-31' };

/**
 * 4분기 누적액 보정
 * 
 */
export const editQuar = async (earn) => {
    for await (let year of years) {
        let sum = { revenue: 0, profit: 0, cnt: 0 }
        for await (let type of '3241') {
            const key = `${year}${types[type]}`;
            const i = earn.data.findIndex(e => e.date == key);
            const close = earn.data[i];
            if (!close) continue;
            let rev = close.revenue || 0;
            let pro = close.profit || 0;
            if (type != '1') {
                sum.revenue += rev;
                sum.profit += pro;
                sum.cnt += 1;
            } else {
                rev -= sum.revenue;
                rev /= 4 - sum.cnt;
                pro -= sum.profit;
                pro /= 4 - sum.cnt;
                earn.data[i].revenue = Int(rev);
                earn.data[i].profit = Int(pro);
            }
        }
    }
}

// 이익의 첫항목에 자본을 더함.
export const earnStack = async (earn) => {
    if (!earn.data?.length) return;
    const first = earn?.data?.sort(dt.sort)?.slice(-1)[0];
    const h = { revenue: 0, profit: first.equity };
    for await (let year of years) {
        let yearEarn = { revenue: 0, profit: 0, cnt: 4 };
        for await (let type of '3241') {
            let key = `${year}${types[type]}`;
            let i = earn.data.findIndex(e => e.date == key);
            let close = earn.data[i];
            if (!close) continue;
            let rev = close.revenue || 0;
            let pro = close.profit || 0;
            h.revenue += rev;
            h.profit += pro;
            yearEarn.revenue += rev;
            yearEarn.profit += pro;
            earn.data[i].sum = {
                revenue: h.revenue,
                profit: h.profit,
            };
            yearEarn.cnt -= 1;
        }
        if (yearEarn.cnt) {
            h.revenue -= yearEarn.revenue;
            h.profit -= yearEarn.profit;
            h.revenue += Int(yearEarn.revenue * 4 / yearEarn.cnt);
            h.profit += Int(yearEarn.profit * 4 / yearEarn.cnt);
        }
    }
}

async function close(data, date, dates) {
    if (!dates.length) return false;
    date = new Date(date);
    const close = await dates.reduce((prev, curr) => {
        const pd = new Date(prev);
        const cd = new Date(curr);
        return (Math.abs(cd - date) < Math.abs(pd - date) ? curr : prev);
    });
    return data.find(e => e.date == close) || false;
}
/**
 * priceChart에 bps와 eps나타내기
 * 
 */
export const earnonPrice = async ({ stockPrice, stockEarn }) => {
    stockEarn = stockEarn.data;
    stockPrice.data?.sort(dt.lsort);
    const earnDates = stockEarn.map(e => e.date);

    for await (const e of stockPrice.data) {
        const closeEarn = await close(stockEarn, e.date, earnDates);
        if (closeEarn?.equity && closeEarn.sum?.profit) {
            e.bps = closeEarn.equity;
            e.eps = closeEarn.sum?.profit;
        }
    };
};