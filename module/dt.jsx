const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const pad = (v) => String(v).padStart(2, '0');

const dt = {
    DAY: 1000 * 60 * 60 * 24,
    YEARS: () => Array.from(Array(10).keys(), x => dt.toJson().Y - x).sort(),
    parse: (str, format = 'YYYY-MM-DD') => {
        return moment(str).format(format);
    },
    /**
     * 현재가 장중인지 return 하는 함수
     * 장중이면 return 0
     * 
     * update하는 시간이 1시간까지 걸리는 것을 감안해 
     * 8:00부터 3:40분까지를 장중으로 함
     * before이면 -1, after이면 1을 return
     */
    market: (m = moment()) => {
        m = moment(m);
        const day = m.day();
        if (day == 0 || day == 6) return 1;
        const v = m.hour() * 60 + m.minute();
        if (v < 480) return -1;
        if (v > 940) return 1;
        return 0;
    },
    /**
     * 업데이트를 해야 하면 return 1
     * 
     * * 데이터가 없으면 (last=0) 요일 관계없이 업데이트 함
     * * 장중에는 업데이트 안함
     * * 월요일 장후 부터 토요일 0시까지는 당일 8시로 설정한 뒤 last가 더 작으면 함
     * * 토요일 0시부터 월요일 장전까지는 금요일 8시로 설정한 뒤 last가 더 작으면 함
     */
    update: (dict) => {
        const last = dict?.last || 0;
        if (!last) return 1;
        if (!dt.market()) return 0;
        const m = moment();
        const day = m.day();
        var fri = day == 0 || day == 6;
        if (day == 1 && dt.market() == -1) fri = 1;
        m.set({ hour: 8, minute: 0, second: 0 });
        if (day == 0) m.set({ date: m.date() - 2 });
        if (day == 6) m.set({ date: m.date() - 1 });
        if (day == 1 && fri) m.set({ date: m.date() - 3 });
        return last < m;
    },
    toJson: (m = moment()) => {
        m = moment(m);
        let Y, M, D;
        Y = String(m.year());
        M = pad(m.month() + 1);
        D = pad(m.date());
        return {
            now: m, Y, M, D,
            day: (1 + m.day()) % 7,
            s: Y + M + D
        }
    },
    prev: (y) => {
        y.now.set({ date: y.now.date() - 1 });
        y.Y = y.now.year().toString();
        y.M = pad(y.now.month() + 1);
        y.D = pad(y.now.date());
        y.day = (1 + y.now.day()) % 7;
        y.s = y.Y + y.M + y.D;
    },
    num: (m = moment()) => moment(m).valueOf(),
    /**
     * 시간 내림차순 정렬 (현재 -> 과거)
     */
    sort: (a, b) => moment(b.d || b.date) - moment(a.d || a.date),
    /**
     * 시간 오름차순 정렬 (과거 -> 현재)
     */
    lsort: (a, b) => moment(a.d || a.date) - moment(b.d || b.date),
    min: (...arr) => moment(Math.min(...arr.map(e => moment(e)))),
    toString: (m = moment(), props = { time: 0 }) => {
        m = moment(m);
        if (!props.time) return m.format('YYYY-MM-DD');
        return m.format('YYYY-MM-DD HH:mm:ss');
    },
    hhmmss: (m = moment()) => {
        m = moment.duration(m);
        return `${pad(m.hours())}:${pad(m.minutes())}:${pad(m.seconds())}`;
    },
}

module.exports = dt;