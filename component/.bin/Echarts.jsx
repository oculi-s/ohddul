import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import groupColors from '@/public/group/color';

const ReactEcharts = dynamic(() => import('echarts-for-react'), {
    ssr: false,
    loading: () => <div>Loading Chart...</div>,
});

function refineData({ group, price, meta }) {
    const all = price;
    const result = Object.values(group)
        .filter(e => e.price)
        .map(({ name, price, child }) => ({
            name,
            value: price,
            children: child?.map(e => ({
                name: meta[e]?.n,
                value: meta[e]?.a * all[e]?.c,
                levels: getLevelOption(name)
            }))
        }));
    return result;
}

function getLevelOption(name) {
    return [
        {
            itemStyle: {
                borderWidth: 0,
                gapWidth: 5
            }
        },
        {
            itemStyle: {
                gapWidth: 1
            }
        },
        {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
                gapWidth: 1,
                backgroundColor: groupColors[name],
                borderColorSaturation: 0.6
            }
        }
    ];
}

const TreeMapChart = ({ group, price, meta }) => {
    meta = meta?.data;
    group = group?.data;
    const data = refineData({ group, price, meta });
    const [chartLoaded, setChartLoaded] = useState(false);
    useEffect(() => {
        setChartLoaded(true);
    }, []);
    const option = {
        series: [{
            type: 'treemap', data,
            label: {},
            legend: { show: false },
        },],
    };
    return (
        <>
            {chartLoaded ? (
                <ReactEcharts
                    option={option}
                    style={{ height: '100%', width: '100%' }}
                    notMerge={true}
                    lazyUpdate={true}
                    opts={{ renderer: "svg" }}
                />
            ) : (
                <div>Loading Chart...</div>
            )}
        </>
    );
};

export default TreeMapChart;