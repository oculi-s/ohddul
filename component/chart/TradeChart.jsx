import React, { useEffect, useRef, useState } from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import {
    bollingerBand,
    discontinuousTimeScaleProviderBuilder,
    Chart,
    ChartCanvas,
    CurrentCoordinate,
    BarSeries,
    CandlestickSeries,
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
    GroupTooltip,
} from "react-financial-charts";
import scss from '$/variables.module.scss';
import { Loading } from "#/base/base";
import { H2R, Price } from "@/module/ba";
import stockstyles from '$/Stock/Stock.module.scss';

const ws = [0, 20, 60, 120];
const margin = { left: 0, right: 60, top: 0, bottom: 24 };
const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => new Date(d?.d));
const bpsSeries = d => d.bps;
const epsSeries = d => d.eps;
const bbs = ws.map((e, i) => bollingerBand().id(1).options({ windowSize: ws[i] }).merge((d, c) => { d.bb = c; d.pb = (d.close - d.bb?.bottom) / (d.bb?.top - d.bb?.bottom) * 100; }).accessor(d => d.bb));
const pbs = ws.map((e, i) => bollingerBand().id(2).options({ windowSize: ws[i] }).merge((d, c) => { d.bb = c; d.pb = (d.close - d.bb?.bottom) / (d.bb?.top - d.bb?.bottom) * 100; }).accessor(d => d.pb));

// const barChartExtents = (d) => d.v;
// const volumeColor = (d) => H2R(d.close > d.open ? scss.tradeUp : scss.tradeDown, .3);
// const volumeSeries = (d) => d.v;
const yEdgeIndicator = (d) => d.close;
const openCloseColor = (d) => d.close > d.open ? scss.tradeUp : scss.tradeDown;
const pbColor = (d) => H2R(d.pb < 50 ? scss.tradeUp : scss.tradeDown, .3);

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

function PriceChart({ width, height, price, addEarn, isGroup, load, setLoad,
    data, xScale, xAccessor, displayXAccessor, windowIndex, setBollinger, isEarn, setEarn, bb, pb,
}) {
    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 300)]);
    const xExtents = [min, max + 5];

    const ohlcFormat = isGroup ? d => Price(d, 0, true) : format('d');
    const yFormat = isGroup ? d => Price(d, 0, true) : format(".0f");
    const pbFormat = d => `${d.toFixed(2)}%`;

    const gridHeight = height - margin.top - margin.bottom;

    const subChartHeight = 100;
    const subChartOrigin = (_, h) => [0, h - subChartHeight];
    // const barChartHeight = gridHeight / 4;
    // const barChartOrigin = (_, h) => [0, h - barChartHeight - subChartHeight];
    const chartHeight = gridHeight - subChartHeight;
    const timeDisplayFormat = timeFormat("%Y-%m-%d");
    const candleChartExtents = isEarn ? (d) => [Math.max(d.high, d.bps, d.eps), Math.min(d.bps, d.eps, d.low)] : d => [d.high, d.low];

    async function makeFixed(e) {
        const par = e.target?.closest(`.${stockstyles.priceChart}`);
        par?.classList?.toggle(stockstyles.fixed);
    }

    if (!data?.length) return <Loading left="auto" right="auto" />
    return <ChartCanvas
        ratio={3}
        height={height}
        width={width}
        margin={margin}
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={xExtents}
        displayXAccessor={displayXAccessor}
        zoomAnchor={lastVisibleItemBasedZoomAnchor}
        clamp='left'
        defaultFocus={true}
        onDoubleClick={makeFixed}
    >
        {/* <Chart id={2} height={barChartHeight} origin={barChartOrigin} yExtents={barChartExtents}>
                <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
            </Chart> */}
        <Chart id={3} height={chartHeight} yExtents={candleChartExtents} >
            <XAxis showGridLines showTickLabel={false} gridLinesStrokeStyle={scss.bgMidBright} tickLabelFill={scss.textBright} className="d" />
            <YAxis showGridLines {...axisStyles} tickFormat={yFormat} />

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
                options={[
                    { yAccessor: d => d.bps, yLabel: 'BPS', valueFill: scss.textBright, },
                    { yAccessor: d => d.eps, yLabel: 'EPS', valueFill: scss.textBright }
                ]} /> : ''}
            <MouseCoordinateY rectWidth={margin.right} displayFormat={yFormat} />
            <EdgeIndicator
                itemType="last"
                rectWidth={margin.right}
                fill={openCloseColor}
                lineStroke={openCloseColor}
                displayFormat={yFormat}
                yAccessor={yEdgeIndicator} />
            <ZoomButtons {...zoomButtonStyles} onReset={e => { console.log(e.target) }} />
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
                displayFormat={pbFormat} />
        </Chart>
        <CrossHairCursor />
    </ChartCanvas>;
}

import PropTypes from "prop-types";

PriceChart.propTypes = {
    dateTimeFormat: PropTypes.string,
    height: PropTypes.number,
    margin: PropTypes.object,
    priceDisplayFormat: PropTypes.func,
    ratio: PropTypes.number,
    width: PropTypes.number
};

PriceChart.defaultProps = {
    dateTimeFormat: "%d %b '%y \xa0 %H:%M",
    margin: { left: 0, right: 48, top: 0, bottom: 24 },
    priceDisplayFormat: format(".2f"),
    ratio: 0,
};

function PriceLine(props) {
    const price = props?.price;
    const [windowIndex, setBollinger] = useState(2);
    const [isEarn, setEarn] = useState(false);
    const pb = pbs[windowIndex];
    const bb = bbs[windowIndex];
    if (!price?.find(e => true)?.open) {
        price?.forEach((e) => {
            e.open = e.o;
            e.high = e.h;
            e.low = e.l;
            e.close = e.c;
        });
    }
    if (price) {
        bb(price);
        props = {
            ...props, ...ScaleProvider(price),
            windowIndex, setBollinger, isEarn, setEarn,
            bb, pb
        };
    }
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {!price
                ? <Loading left="auto" right="auto" />
                : <PriceChart {...props} />}
        </div>
    )
}

export default React.memo(withSize({ style: { height: '100%', width: '100%' } })(
    withDeviceRatio()(PriceLine))
);