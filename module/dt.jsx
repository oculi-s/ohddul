const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const pad = (v) => String(v).padStart(2, '0');

const TYPES = { '-03-31': 3, '-06-30': 2, '-09-30': 4, '-12-31': 1 };
const DAY = 1000 * 60 * 60 * 24;
const YEARS = Array.from(Array(10).keys(), x => toJson().Y - x).sort().filter(e => e > 2014);
const EARNKEYS = YEARS.map(year => Object.keys(TYPES).map(type => `${year}${type}`)).flat().filter(e => num(e) <= num() && num(e) >= num('2015-'));
function YEARTYPE(key) { return [key.slice(0, 4), TYPES[key.slice(4)]] };
function parse(str = moment(), format = 'YYYY-MM-DD') {
    return moment(str).format(format);
}
function toQuar(m = moment()) {
    const str = moment(m).format('YYYY-MM-DD');
    const Y = str.slice(0, 4);
    const Q = Object.keys(TYPES).indexOf(str.slice(4));
    return `${Y} ${Q + 1}Q`;
}
/**
 * 현재가 장중인지 return 하는 함수
 * 장중이면 return 0
 * 
 * update하는 시간이 1시간까지 걸리는 것을 감안해 
 * 8:00부터 3:40분까지를 장중으로 함
 * before이면 -1, after이면 1을 return
 */
function market(m = moment()) {
    m = moment(m);
    const day = m.day();
    if (day == 0 || day == 6) return 1;
    const v = m.hour() * 60 + m.minute();
    if (v < 480) return -1;
    if (v > 940) return 1;
    return 0;
}
/**
 * 업데이트를 해야 하면 return 1
 * 
 * * 데이터가 없으면 (last=0) 요일 관계없이 업데이트 함
 * * 장중에는 업데이트 안함
 * * 월요일 장후 부터 금요일 11:59까지는 
 * * * 장후부터 자정까지는 당일 8시로 설정한 뒤 last가 더 작으면 함
 * * * 자정부터 다음날 장전까지는 전일 8시로 설정한 뒤 last가 더 작으면 함
 * * 토요일 0시부터 월요일 장전까지는 금요일 8시로 설정한 뒤 last가 더 작으면 함
 */
function update(dict) {
    const last = dict?.last || 0;
    const mkt = market();
    if (!last) return 1;
    if (!mkt) return 0;
    const m = moment();
    const day = m.day();
    var fri = day == 0 || day == 6;
    if (day == 1 && mkt == -1) fri = 1;
    m.set({ hour: 8, minute: 0, second: 0 });
    if (day == 0) m.set({ date: m.date() - 2 });
    else if (day == 6) m.set({ date: m.date() - 1 });
    else if (day == 1 && fri) m.set({ date: m.date() - 3 });
    else if (mkt == -1) m.set({ date: m.date() - 1 });
    return last < m;
}
function toJson(m = moment()) {
    m = moment(m);
    let Y, M, D;
    Y = String(m.year());
    M = pad(m.month() + 1);
    D = pad(m.date());
    return {
        now: m, Y, M, D,
        day: (1 + m.day()) % 7,
        s: Y + M + D
    };
}
function prev(y) {
    y.now.set({ date: y.now.date() - 1 });
    y.Y = y.now.year().toString();
    y.M = pad(y.now.month() + 1);
    y.D = pad(y.now.date());
    y.day = (1 + y.now.day()) % 7;
    y.s = y.Y + y.M + y.D;
}
function now(m = moment()) { return moment(m); }
function num(m = moment()) { return moment(m).unix(); }
/**
 * 시간 내림차순 정렬 (현재 -> 과거)
 */
function sort(a, b) { return moment(b.d || b.date) - moment(a.d || a.date); }
/**
 * 시간 오름차순 정렬 (과거 -> 현재)
 */
function lsort(b, a) { return moment(b.d || b.date) - moment(a.d || a.date); }
function min(...arr) { return moment(Math.min(...arr.map(e => moment(e)))); }
function toString(m = moment(), props = { time: 0 }) {
    m = moment(m);
    if (!props.time) return m.format('YYYY-MM-DD');
    return m.format('YYYY-MM-DD HH:mm:ss');
}
function hhmmss(m = moment()) {
    m = moment.duration(m);
    return `${pad(m.hours())}:${pad(m.minutes())}:${pad(m.seconds())}`;
}

module.exports = {
    DAY, YEARS, EARNKEYS, YEARTYPE,
    parse,
    market, update, toJson, toString, toQuar,
    prev, now, num, sort, lsort, min, hhmmss
};