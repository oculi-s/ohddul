import '@/module/array';

const BMTPB = (price, num) => {
    price = price?.slice(0, num);
    const last = price?.find(() => true);
    const b = Math.std(price, -2);
    const m = Math.avg(price);
    const t = Math.std(price, 2);
    const p = (last - b) / (t - b);
    const bw = (t - b) / m;
    return [b, m, t, p, bw];
}

export function getMaData(price) {
    price = price?.map(e => e?.c);
    const last = price?.find(() => true);
    const [bot20, avg20, top20, pb20, bw20] = BMTPB(price, 20);
    const [bot60, avg60, top60, pb60, bw60] = BMTPB(price, 60);
    const [bot120, avg120, top120, pb120, bw120] = BMTPB(price, 120);

    return {
        last,
        bot20, avg20, top20, pb20, bw20,
        bot60, avg60, top60, pb60, bw60,
        bot120, avg120, top120, pb120, bw120
    }
}