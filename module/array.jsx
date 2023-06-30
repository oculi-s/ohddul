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