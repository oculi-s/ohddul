import React, { useEffect, useState, StrictMode, useRef } from "react";
import ReactDOM from "react-dom";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import useDimensions from 'react-use-dimensions'
import {
    ema,
    MovingAverageTooltip,
    bollingerBand,
    elderRay,
    discontinuousTimeScaleProviderBuilder,
    Chart,
    ChartCanvas,
    CurrentCoordinate,
    BarSeries,
    CandlestickSeries,
    ElderRaySeries,
    LineSeries,
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
    BollingerBandTooltip,
    BollingerSeries,
    StackedBarSeries,
    AlternatingFillAreaSeries,
    AreaSeries,
    GroupTooltip,
} from "react-financial-charts";
import scss from '$/variables.module.scss';
import { Loading } from "#/base/base";
import { H2R, Int, Price } from "@/module/ba";

const ws = [0, 20, 60, 120];
const margin = { left: 0, right: 60, top: 0, bottom: 24 };
const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => new Date(d?.d));
const bpsSeries = d => d.bps;
const epsSeries = d => d.eps;

const axisStyles = {
    strokeStyle: "#383E55", // Color.GRAY
    strokeWidth: 2,
    tickLabelFill: "#9EAAC7", // Color.LIGHT_GRAY
    tickStrokeStyle: "#383E55",
    gridLinesStrokeStyle: "rgba(56, 62, 85, 0.5)" // Color.GRAY w Opacity
};

const zoomButtonStyles = {
    fill: "#383E55",
    fillOpacity: 0.75,
    strokeWidth: 0,
    textFill: "#9EAAC7"
};


const coordinateStyles = {
    fill: "#383E55",
    textFill: "#FFFFFF"
};

const crossHairStyles = {
    strokeStyle: "#9EAAC7"
};


const PriceChart = ({ width, height, price, addEarn, isGroup, load, setLoad }) => {
    if (!price) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loading left="auto" right="auto" />
        </div>
    }
    const [windowIndex, setBollinger] = useState(2);
    const [isEarn, setEarn] = useState(false);

    const bb = bollingerBand().id(1).options({ windowSize: ws[windowIndex] }).merge((d, c) => { d.bb = c; d.pb = (d.close - d.bb?.bottom) / (d.bb?.top - d.bb?.bottom) * 100; }).accessor(d => d.bb);
    const pb = bollingerBand().id(2).options({ windowSize: ws[windowIndex] }).merge((d, c) => { d.bb = c; d.pb = (d.close - d.bb?.bottom) / (d.bb?.top - d.bb?.bottom) * 100; }).accessor(d => d.pb);
    bb(price);
    const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(price);
    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 300)]);
    const xExtents = [min, max + 5];

    const ohlcFormat = isGroup ? d => Price(d, 0, true) : format('d');
    const yFormat = isGroup ? d => Price(d, 0, true) : format(".0f");
    const pbFormat = d => `${d.toFixed(2)}%`;

    const gridHeight = height - margin.top - margin.bottom;

    const subChartHeight = 100;
    const subChartOrigin = (_, h) => [0, h - subChartHeight];
    const barChartHeight = gridHeight / 4;
    const barChartOrigin = (_, h) => [0, h - barChartHeight - subChartHeight];
    const chartHeight = gridHeight - subChartHeight;
    const timeDisplayFormat = timeFormat("%Y-%m-%d");

    const barChartExtents = (d) => d.v;
    const candleChartExtents = isEarn ? (d) => [Math.max(d.high, d.bps, d.eps), Math.min(d.bps, d.eps, d.low)] : d => [d.high, d.low];
    const yEdgeIndicator = (d) => d.close;
    const volumeColor = (d) => H2R(d.close > d.open ? scss.tradeUp : scss.tradeDown, .3);
    const volumeSeries = (d) => d.v;
    const openCloseColor = (d) => d.close > d.open ? scss.tradeUp : scss.tradeDown;
    const pbColor = (d) => H2R(d.pb < 50 ? scss.tradeUp : scss.tradeDown, .3);

    console.log(1);

    return !data?.length ?
        <Loading left="auto" right="auto" />
        : <ChartCanvas
            ratio={3}
            height={height}
            width={width}
            margin={margin}
            data={data}
            seriesName="Data"
            xScale={xScale}
            xAccessor={xAccessor}
            xExtents={xExtents}
            displayXAccessor={displayXAccessor}
            zoomAnchor={lastVisibleItemBasedZoomAnchor}

        >
            <Chart id={2} height={barChartHeight} origin={barChartOrigin} yExtents={barChartExtents}>
                <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
            </Chart>
            <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
                <XAxis showGridLines showTickLabel={false} gridLinesStrokeStyle={scss.bgMidBright} tickLabelFill={scss.textBright} />
                <YAxis showGridLines {...axisStyles} />

                <CandlestickSeries />
                {windowIndex ? <><BollingerSeries yAccessor={bb.accessor()} strokeStyle={bb.stroke()} />
                    <CurrentCoordinate yAccessor={bb.accessor()} fillStyle={bb.stroke()} /></> : ''}

                {addEarn && isEarn ? <><LineSeries yAccessor={bpsSeries} strokeStyle={scss.red} />
                    <CurrentCoordinate yAccessor={bpsSeries} fillStyle={scss.red} />
                    <LineSeries yAccessor={epsSeries} strokeStyle={scss.blue} />
                    <CurrentCoordinate yAccessor={epsSeries} fillStyle={scss.blue} /></> : ''}

                <OHLCTooltip origin={[8, 16]} textFill={openCloseColor} ohlcFormat={ohlcFormat} changeFormat={ohlcFormat} labelFill={scss.textBright} />
                <BollingerBandTooltip origin={[8, 32]} options={bb.options()} onClick={e => setBollinger((windowIndex + 1) % ws.length)} displayFormat={yFormat} textFill={scss.textBright} />
                {addEarn ? <GroupTooltip origin={[8, 48]} displayFormat={d => parseInt(d)} onClick={e => setEarn(!isEarn)}
                    options={[{
                        yAccessor: d => d.bps,
                        yLabel: 'BPS',
                        valueFill: scss.textBright,
                    }, {
                        yAccessor: d => d.eps,
                        yLabel: 'EPS',
                        valueFill: scss.textBright
                    }]}
                /> : ''}
                <MouseCoordinateY rectWidth={margin.right} displayFormat={yFormat} />
                <EdgeIndicator
                    itemType="last"
                    rectWidth={margin.right}
                    fill={openCloseColor}
                    lineStroke={openCloseColor}
                    displayFormat={yFormat}
                    yAccessor={yEdgeIndicator} />
                <ZoomButtons {...zoomButtonStyles} />
            </Chart>
            <Chart id={4} height={subChartHeight} yExtents={[-20, 120]} origin={subChartOrigin} padding={{ top: 8, bottom: 8 }}>
                <XAxis showGridLines gridLinesStrokeStyle={scss.bgMidBright} tickLabelFill={scss.textBright} />
                <YAxis ticks={3} tickFormat={pbFormat} tickLabelFill={scss.textBright} zoomEnabled={false} />
                <MouseCoordinateX displayFormat={timeDisplayFormat} />
                <MouseCoordinateY rectWidth={margin.right} displayFormat={pbFormat} />
                <LineSeries yAccessor={pb.accessor()} strokeStyle={scss.textColor} />
                <BarSeries yAccessor={pb.accessor()} baseAt={50} fillStyle={pbColor} />
                <SingleValueTooltip yAccessor={pb.accessor()} yLabel="%B" yDisplayFormat={pbFormat} origin={[8, 16]} valueFill={scss.textBright} />
                <EdgeIndicator
                    itemType="last"
                    rectWidth={margin.right}
                    yAccessor={pb.accessor()}
                    displayFormat={pbFormat}
                />
            </Chart>
            <CrossHairCursor {...crossHairStyles} />
        </ChartCanvas>
}

// useDimensions를 사용하면 스크롤마다 리렌더링이 되는 문제 생김

function PriceLine({ price, addEarn, isGroup, load, setLoad }) {
    const [props, setProps] = useState();
    const ref = useRef();
    useEffect(() => {
        const width = ref?.current?.offsetWidth;
        const height = ref?.current?.offsetHeight;
        setProps({ width, height });
    }, [])
    price = price?.map(({ o, h, l, c, v, d, bps, eps }) => ({
        open: o, high: h, low: l, close: c, v, d, bps, eps,
    }));
    return (
        <div ref={ref} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PriceChart
                width={props?.width}
                height={props?.height}
                price={price}
                addEarn={addEarn}
                isGroup={isGroup}
                load={load}
                setLoad={setLoad}
            />
        </div>
    )
}

export default PriceLine;
