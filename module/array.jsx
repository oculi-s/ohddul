Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b, 0)
};

Array.prototype.remove = function (v) {
    let i = this.indexOf(v);
    if (i > -1) this.splice(i, 1);
}
