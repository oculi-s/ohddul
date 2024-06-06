import scss from '$/variables.module.scss';

export const hairline = {
    afterDraw: function (chart) {
        if (chart.tooltip?._active?.length) {
            let x = chart.tooltip._active[0].element.x;
            let yAxis = chart.scales.y;
            let ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 1;
            ctx.strokeStyle = scss.bgBrighter;
            ctx.stroke();
            ctx.restore();
        }
    }
}

export const caret = {
    onHover: function (event) {
        console.log(event);
        const ctx = this?.ctx;
        const y = event?.y;
        const x = event?.x;
        const xAxis = this?.scales?.x;
        const yAxis = this?.scales?.y;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xAxis.left, y);
        ctx.lineTo(xAxis.right, y);
        ctx.moveTo(x, yAxis.top);
        ctx.lineTo(x, yAxis.bottom);

        ctx.lineWidth = 1;
        ctx.strokeStyle = scss.bgBrighter;
        ctx.stroke();
        ctx.restore();
    }
}