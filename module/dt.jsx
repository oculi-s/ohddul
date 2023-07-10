const moment = require('moment');
moment.suppressDeprecationWarnings = true;
require('moment-timezone');
require('moment-duration-format')(moment);
moment.tz.setDefault("Asia/Seoul");
const pad = (v) => String(v).padStart(2, '0');

const DAYS = ['일', '월', '화', '수', '목', '금', '토']
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

/**
 * 유저가 마지막으로 예측한 시간을 보고 예측가능한지 확인하는 함수
 * 가능하면 true, 불가능하면 false
 * 
 * 장전을 기준으로 장 시작 이후에 예측이 있다면 예측 불가 아니면 가능
 * * 토일요일은 금요일 장 후 예측이 없을 때 예측가능
 * * 토요일은 하루 전, 일요일은 이틀전으로 만든 뒤 예측시간과 비교
 * * 00:00-08:59 자정부터 장 전이라면 마지막 예측이 전날 9시 이전이어야 함.
 * * 09:00-23:59 장중부터 자정이라면 마지막 예측이 당일 9시 이전이어야 함.
 */
function pred(d = 0) {
    d = moment(d);
    const m = moment();
    const mkt = market();
    const day = m.day();
    if (day == 0) m.set({ date: m.date() - 2, hour: 15, minute: 30, second: 0 });
    else if (day == 6) m.set({ date: m.date() - 1, hour: 15, minute: 30, second: 0 });
    else {
        m.set({ hour: 8, minute: 59, second: 0 })
        if (mkt == -1) m.set({ date: m.date() - 1 });
    }
    return d < m;
}

/**
 * 입력인 예측시간을 바탕으로 채점 시간 (기준시간) 을 계산하는 함수
 * 
 * * 금요일 장 중부터 월요일 장전까지는 월요일 장후
 */
function scoring(d = 0) {
    d = moment(d);
    const mkt = market(d);
    const day = d.day();
    d.set({ hour: 15, minute: 30, second: 0 });
    if (day == 0) d.set({ date: d.date() + 1 });
    else if (day == 6) d.set({ date: d.date() + 2 });
    else if (day == 5 && 0 <= mkt) d.set({ date: d.date() + 3 });
    else if (0 <= mkt) d.set({ date: d.date() + 1 });
    return d;
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
function num(m = moment()) { return moment(m).valueOf(); }
/**
 * 시간 내림차순 정렬 (현재 -> 과거)
 */
function sort(a, b) { return moment(b.d || b.date) - moment(a.d || a.date); }
/**
 * 시간 오름차순 정렬 (과거 -> 현재)
 */
function lsort(b, a) { return moment(b.d || b.date) - moment(a.d || a.date); }
function min(...arr) { return moment(Math.min(...arr.map(e => moment(e)))); }
function toString(m, props = { time: 0, day: 0 }) {
    const { time, day } = props;
    m = moment(m || moment());
    const sdate = m.format('YYYY-MM-DD');
    const stime = m.format('HH:mm:ss');
    const sday = DAYS[m.day()];
    if (!time && !day) return sdate;
    else if (time && !day) return `${sdate} ${stime}`;
    else if (!time && day) return `${sdate}(${sday})`;
    else return `${sdate}(${sday}) ${stime}`
}
function hhmmss(m = moment()) {
    m = moment.duration(m);
    return `${pad(m.hours())}:${pad(m.minutes())}:${pad(m.seconds())}`;
}
function duration(m = moment(), format = 'DD HH:mm:ss') {
    m = moment.duration(m);
    return m.format(format);
}

module.exports = {
    DAY, YEARS, EARNKEYS, YEARTYPE,
    parse, pred, scoring, duration,
    market, update, toJson, toString, toQuar,
    prev, now, num, sort, lsort, min, hhmmss
};