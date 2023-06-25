let pad = (v) => String(v).padStart(2, '0');

const dt = {
    DAY: 1000 * 60 * 60 * 24,
    YEARS: () => Array.from(Array(10).keys(), x => dt.toJson().Y - x).sort(),
    parse: (str) => {
        let Y, M, D;
        Y = str.slice(0, 4);
        M = str.slice(4, 6);
        D = str.slice(6);
        return `${Y}-${M}-${D}`;
    },
    update: (dict) => {
        if (dt.now().getDay() == 1) return 0;
        return (dt.toString() != dt.toString(dict?.last || 0));
    },
    now: () => {
        const curr = new Date();
        const utc =
            curr.getTime() +
            (curr.getTimezoneOffset() * 60 * 1000);

        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        return new Date(utc + (KR_TIME_DIFF));
    },
    toJson: (now = dt.now()) => {
        now = new Date(now);
        let Y, M, D;
        Y = String(now.getFullYear());
        M = pad(now.getMonth() + 1);
        D = pad(now.getDate());
        return {
            now, Y, M, D,
            day: (1 + now.getDay()) % 7,
            s: Y + M + D
        }
    },
    toString: (now = dt.now(), props = { time: 0 }) => {
        now = new Date(now);
        let Y = now.getFullYear();
        let M = now.getMonth() + 1;
        let D = now.getDate();
        let res = `${Y}-${pad(M)}-${pad(D)}`;
        if (!props.time) return res;
        let h = now.getHours();
        let m = now.getMinutes();
        let s = now.getSeconds();
        return `${res} ${pad(h)}:${pad(m)}:${pad(s)}`;
    },
    hhmmss: (now = new Date()) => {
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        now = new Date(now - KR_TIME_DIFF);
        let h = now.getHours();
        let m = now.getMinutes();
        let s = now.getSeconds();
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    },
    prev: (y) => {
        y.now.setDate(y.now.getDate() - 1);
        y.Y = y.now.getFullYear().toString();
        y.M = (y.now.getMonth() + 1).toString().padStart(2, '0');
        y.D = y.now.getDate().toString().padStart(2, '0');
        y.day = (1 + y.now.getDay()) % 7;
        y.s = y.Y + y.M + y.D;
    },
    num: (now = Date.now()) => {
        now = new Date(now);
        return now.getTime();
    },
    sort: (a, b) => new Date(b.date) - new Date(a.date),
    lsort: (a, b) => new Date(a.date) - new Date(b.date),
    min: (...arr) => new Date(Math.min(...arr.map(e => new Date(e)))),
}

export default dt;