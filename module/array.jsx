Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b, 0)
};

Array.prototype.remove = function (v) {
    let i = this.indexOf(v);
    if (i > -1) this.splice(i, 1);
}

Math.avg = (d) => {
    return Math.round(d?.sum() / d?.length);
}

Math.std = (d, k) => {
    let mean = Math.avg(d);
    let diff = d.map(e => (e - mean) * (e - mean)).sum();
    return Math.round(mean + k * Math.sqrt(diff / d.length));
}

Math.randInt = () => {
    return parseInt(Math.random() * 1000);
}


/**
 * React에서 Object에 prototype function을 만들면 안된다.
 *
 * 그러면 아래 오류 뜨게됨
 * Error occurred prerendering page "/404". Read more: https://nextjs.org/docs/messages/prerender-error TypeError: e.replace is not a function
 */
// Object.prototype.deepdeep = function (b) {
//     const merge = (a, b) => {
//         return Object.entries(b).reduce((o, [k, v]) => {
//             o[k] = v && typeof v === 'object'
//                 ? merge(o[k] = o[k] || (Array.isArray(v) ? [] : {}), v)
//                 : v;
//             return o;
//         }, a);
//     }
//     return [{}, this, b].reduce(merge);
// }