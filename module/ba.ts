/**
 * Simple int to string
 * 
 * 쉼표를 포함한 숫자형식
 */
export const Num = (n: number = 0) => {
    const s = String(Math.round(n || 0));
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Simple string to int
 */
export const Int = (s: string = '0') => {
    s = String(s);
    return parseInt(s.replace(/,/g, '')) || 0;
}

export const NumFix = (v: number = 0, f: number = 1) => {
    const vs = v.toFixed(f);
    const left = parseInt(vs.split('.')[0]);
    const right = vs.split('.')[1];
    return Num(left) + (right ? '.' + right : '');
}

/**
 * 단순히 float를 fix하는 함수, 앞에 +붙음 
 */
export const Fix = (f, n = 2) => {
    if (isNaN(f)) f = 0;
    return (f > 0 ? '+' : '') + f.toFixed(n);
}

export const parseFix = (f, n = 2) => {
    if (isNaN(f)) f = 0;
    return parseFloat(f.toFixed(n));
}

/**
 * a==b인경우 아무것도 없음
 * a>b인경우 red, a<b인경우 blue를 return
 */
export const Color = (a = 0, b = 0) => {
    return a == b ? '' : a > b ? 'red' : 'blue';
}

export const Price = (v = 0, f = 1, sym = false) => {
    if (Math.abs(v) > 100000000) v /= 100000000;
    if (Math.abs(v) > 10000)
        return `${NumFix(v / 10000, f)}조`;
    return `${sym ? (v > 0 ? '+' : '') : ''}${Num(v)}억`;
}

/**
 * cur - prev / prev의 퍼센트를 구하는 지표
 */
export const Per = (cur, prev) => {
    return Fix((cur - prev) / prev * 100, 1) + '%'
}
export const Div = (a, b, Fix = 0) => {
    if (a < 0 && b < 0) return '-';
    if (b == 0) return '-';
    const d = Math.pow(10, Fix);
    return (Int(a / b * 100 * d) / d).toFixed(Fix) + '%';
}

export const Sleep = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(true), ms));
}

export const Big = (code = '') => {
    const del = [3, 8, 34, 35, 39, 42, 47, 52, 56, 63, 66, 68, 73, 76, 84, 85, 87, 91, 96, 98, 99];
    const key = parseInt(code.slice(0, 2));
    for (let [i, d] of del.entries()) {
        if (key <= d) {
            return String.fromCharCode(65 + i) + code;
        }
    }
    return code;
}

export const Quar = (date) => {
    const qdict = { '03': 1, '06': 2, '09': 3, '12': 4, }
    const [Y, M, D] = date.split('-');
    const Q = qdict[M];
    const res = { Y, M, D, Q };
    res.s = `${Y} ${qdict[M]}Q`
    return res;
}

export const H2R = (hex = "#000000", alpha = 1) => {
    const [r, g, b] = hex?.match(/\w\w/g)?.map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};