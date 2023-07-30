import React, { useMemo } from "react";
import { ChartCanvas, Chart, XAxis, YAxis, BarSeries, LineSeries } from "react-financial-charts";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { discontinuousTimeScaleProviderBuilder } from "react-financial-charts";

const price = [
    { date: new Date("2023-07-25"), close: 100 },
    { date: new Date("2023-07-26"), close: 150 },
    { date: new Date("2023-07-27"), close: 120 },
    { date: new Date("2023-07-28"), close: 180 },
    { date: new Date("2023-07-29"), close: 180 },
    { date: new Date("2023-07-30"), close: 180 },
    { date: new Date("2023-07-31"), close: 180 },
    { date: new Date("2023-08-01"), close: 180 },
    // Add more data here...
];

const PriceChart = () => {
    const yAccessor = d => d.close;
    const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => new Date(d?.date));
    const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(price);
    console.log(data);
    const xExtents = [data[0].date, data[data.length - 1].date];

    return (
        <div style={{ height: 400, width: 800 }}>
            <ChartCanvas
                seriesName="Data"
                ratio={3}
                height={400}
                width={800}
                data={data}
                margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                xExtents={xExtents}
            >
                <Chart id={1} yExtents={yAccessor} height={400}>
                    {/* <XAxis tickFormat={timeFormat("%Y-%m-%d")} />
                    <YAxis /> */}
                    <BarSeries fillStyle={e => 'white'} yAccessor={yAccessor} />
                    {/* <LineSeries yAccessor={yAccessor} fillStyle={'white'} /> */}
                </Chart>
            </ChartCanvas>
        </div>
    );
};

export default PriceChart;
