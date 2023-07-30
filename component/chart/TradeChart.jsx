import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import useDimensions from 'react-use-dimensions'
import {
    bollingerBand,
    elderRay,
    ema,
    discontinuousTimeScaleProviderBuilder,
    Chart,
    ChartCanvas,
    CurrentCoordinate,
    BarSeries,
    CandlestickSeries,
    ElderRaySeries,
    LineSeries,
    MovingAverageTooltip,
    OHLCTooltip,
    SingleValueTooltip,
    lastVisibleItemBasedZoomAnchor,
    XAxis,
    YAxis,
    CrossHairCursor,
    EdgeIndicator,
    MouseCoordinateX,
    MouseCoordinateY,
    ZoomButtons,
    withDeviceRatio,
    withSize,
    BollingerBandTooltip
} from "react-financial-charts";
import scss from '$/variables.module.scss';
import { Loading } from "#/base/base";

function PriceLine({ price }) {
    if (!price?.length) return <Loading left="auto" right="auto" />;
    price = price?.map(({ o, h, l, c, v, d }) => ({ open: o, high: h, low: l, close: c, v, d }));
    const [ref, { width, height }] = useDimensions();

    const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => new Date(d.d));
    const margin = { left: 0, right: 48, top: 0, bottom: 24 };

    const ema20 = ema()
        .id(1)
        .options({ windowSize: 20 })
        .merge((d, c) => { d.ema20 = c; })
        .accessor((d) => d.ema20);
    const ema60 = ema()
        .id(2)
        .options({ windowSize: 60 })
        .merge((d, c) => { d.ema60 = c; })
        .accessor((d) => d.ema60);
    const ema120 = ema()
        .id(3)
        .options({ windowSize: 120 })
        .merge((d, c) => { d.ema120 = c; })
        .accessor((d) => d.ema120);
    const bb20 = bollingerBand()
        .id(4)
        .options({ windowSize: 20 })
        .merge((d, c) => { d.bb20 = c; })
        .accessor(d => d.bb20?.top);

    const elder = elderRay();
    const calculatedData = elder(ema120(ema60(ema20(bb20(price)))));
    const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(price);
    const yFormat = format(".0f");
    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max + 5];

    const gridHeight = height - margin.top - margin.bottom;

    const elderRayHeight = 100;
    const elderRayOrigin = (_, h) => [0, h - elderRayHeight];
    const barChartHeight = gridHeight / 4;
    const barChartOrigin = (_, h) => [0, h - barChartHeight - elderRayHeight];
    const chartHeight = gridHeight - elderRayHeight;
    const yExtents = (d) => [d.high, d.low];
    const dateTimeFormat = "%m-%d";
    const timeDisplayFormat = timeFormat(dateTimeFormat);

    const barChartExtents = (d) => d.v;
    const candleChartExtents = (d) => [d.high, d.low];
    const yEdgeIndicator = (d) => d.close;

    const volumeColor = (d) => {
        return d.close > d.open
            ? "rgba(38, 166, 154, 0.3)"
            : "rgba(239, 83, 80, 0.3)";
    };

    const volumeSeries = (d) => d.v;
    const openCloseColor = (data) => {
        return data.close > data.open ? "#26a69a" : "#ef5350";
    };

    return <div
        ref={ref}
        style={{ width: '100%', height: '100%' }}
    >
        <ChartCanvas
            ratio={3}
            height={height}
            width={width}
            margin={margin}
            data={data}
            displayXAccessor={displayXAccessor}
            seriesName="Data"
            xScale={xScale}
            xAccessor={xAccessor}
            xExtents={xExtents}
            zoomAnchor={lastVisibleItemBasedZoomAnchor}
        >
            <Chart
                id={2}
                height={barChartHeight}
                origin={barChartOrigin}
                yExtents={barChartExtents}
            >
                <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
            </Chart>
            <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
                <XAxis showGridLines showTickLabel={false} gridLinesStrokeStyle={scss.bgMidBright} tickLabelFill={scss.textBright} />
                <YAxis showGridLines tickFormat={yFormat} gridLinesStrokeStyle={scss.bgMidBright} tickLabelFill={scss.textBright} />
                <CandlestickSeries />
                <LineSeries yAccessor={bb20.accessor()} strokeStyle={bb20.stroke()} />
                <CurrentCoordinate yAccessor={bb20.accessor()} fillStyle={bb20.stroke()} />
                <LineSeries yAccessor={ema20.accessor()} strokeStyle={ema20.stroke()} />
                <CurrentCoordinate yAccessor={ema20.accessor()} fillStyle={ema20.stroke()} />
                <LineSeries yAccessor={ema60.accessor()} strokeStyle={ema60.stroke()} />
                <CurrentCoordinate yAccessor={ema60.accessor()} fillStyle={ema60.stroke()} />
                <LineSeries yAccessor={ema120.accessor()} strokeStyle={ema120.stroke()} />
                <CurrentCoordinate yAccessor={ema120.accessor()} fillStyle={ema120.stroke()} />
                <MouseCoordinateY rectWidth={margin.right} displayFormat={yFormat} />
                <EdgeIndicator
                    itemType="last"
                    rectWidth={margin.right}
                    fill={openCloseColor}
                    lineStroke={openCloseColor}
                    displayFormat={yFormat}
                    yAccessor={yEdgeIndicator} />

                <BollingerBandTooltip
                    origin={[8, 72]}
                    options={[{
                        yAccessor: bb20.accessor(),
                        stroke: bb20.stroke(),
                        windowSize: bb20.options().windowSize
                    }]}
                />
                <MovingAverageTooltip
                    origin={[8, 24]}
                    textFill={scss.textBright}
                    options={[{
                        yAccessor: ema20.accessor(),
                        type: "EMA",
                        stroke: ema20.stroke(),
                        windowSize: ema20.options().windowSize
                    }, {
                        yAccessor: ema60.accessor(),
                        type: "EMA",
                        stroke: ema60.stroke(),
                        windowSize: ema60.options().windowSize
                    }, {
                        yAccessor: ema120.accessor(),
                        type: "EMA",
                        stroke: ema120.stroke(),
                        windowSize: ema120.options().windowSize
                    },]} />
                <ZoomButtons />
                <OHLCTooltip origin={[8, 16]} textFill={scss.textBright} ohlcFormat={e => parseInt(e)} />
            </Chart>
            <Chart
                id={4}
                height={elderRayHeight}
                yExtents={[0, elder.accessor()]}
                origin={elderRayOrigin}
                padding={{ top: 8, bottom: 8 }}
            >
                <XAxis showGridLines gridLinesStrokeStyle={scss.bgMidBright} tickLabelFill={scss.textBright} />
                <YAxis ticks={3} tickFormat={yFormat} tickLabelFill={scss.textBright} />
                <MouseCoordinateX displayFormat={timeDisplayFormat} />
                <MouseCoordinateY rectWidth={margin.right} displayFormat={yFormat} />
                <ElderRaySeries yAccessor={elder.accessor()} />

                <SingleValueTooltip
                    yAccessor={elder.accessor()}
                    yLabel="%B"
                    // yDisplayFormat={(d) => `${yFormat(d.bullPower)}, ${yFormat(d.bearPower)}`}
                    origin={[8, 16]} />
            </Chart>
            <CrossHairCursor />
        </ChartCanvas>
    </div>
}

export default PriceLine;
