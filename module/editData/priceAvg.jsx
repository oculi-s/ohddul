import '@/module/array';

const BMT = (price, num) => {
    price = price?.slice(0, num);
    const b = Math.std(price, -2);
    const m = Math.avg(price);
    const t = Math.std(price, 2);
    return [b, m, t];
}

export function getMaData(price) {
    price = price?.map(e => e?.c);
    const last = price?.find(() => true);
    const [bot20, avg20, top20] = BMT(price, 20);
    const [bot60, avg60, top60] = BMT(price, 60);
    const [bot120, avg120, top120] = BMT(price, 120);

    return {
        last,
        bot20, avg20, top20,
        bot60, avg60, top60,
        bot120, avg120, top120
    }
}