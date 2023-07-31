import React, { useEffect, useRef, useState } from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
    ChartCanvas,
    Chart,
    BarSeries,
    CandlestickSeries,
    XAxis,
    YAxis,
    withDeviceRatio,
    withSize,
} from "react-financial-charts";

const PriceChart = ({ width, height, price }) => {
    const canvasRef = useRef(null);
    const [canvasNodes, setCanvasNodes] = useState([]);

    useEffect(() => {
        // Draw the chart on the canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);

        for (const node of canvasNodes) {
            node(ctx, xScale, yScale);
        }
    }, [canvasNodes, width, height]);

    const yAccessor = (d) => d.close;
    const xAccessor = (d) => new Date(d.date);
    const xExtents = [xAccessor(price[0]), xAccessor(price[price.length - 1])];

    // Your scale and other configurations
    // ...

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <canvas ref={canvasRef} width={width} height={height} />
            <ChartCanvas
                ratio={3}
                width={width}
                height={height}
                data={price}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={xAccessor}
                xExtents={xExtents}
                canvasNodes={setCanvasNodes}
            >
                <Chart id={1} yExtents={yAccessor}>
                    <XAxis />
                    <YAxis />
                    <CandlestickSeries />
                    <BarSeries yAccessor={yAccessor} />
                </Chart>
            </ChartCanvas>
        </div>
    );
};

export default withSize({ style: { height: "100%", width: "100%" } })(
    withDeviceRatio()(PriceChart)
);
