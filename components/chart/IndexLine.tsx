import { Loading } from "@/components/base/base";
import '@/module/array';
import { hairline } from "@/module/chart/plugins";
import dt from "@/module/dt";
import { refineData } from '@/utils/chart/refine';
import { PriceCloseDailyType } from "@/utils/type/stock";
import { Chart, ChartData, ChartOptions } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import Annotation from "chartjs-plugin-annotation";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
Chart.register(Annotation);

const defaultOptions: ChartOptions<'line'> = {
    plugins: {
        legend: {
            display: false,
        },
    },
    animation: {
        duration: 100,
        // x: {
        //     duration: 0
        // }
    },
    interaction: {
        intersect: false,
        mode: 'index',
    },
    spanGaps: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: "time",
            time: {
                tooltipFormat: "yyyy-MM-dd"

            }
        }, y: {}
    }
}

const plugins = [hairline, Annotation];

function IndexLine({
    data = [],
    x = false, y = false,
}: {
    data?: PriceCloseDailyType[],
    x?: boolean, y?: boolean
}) {
    data.sort(dt.lsort);
    defaultOptions.scales.x.display = x;
    defaultOptions.scales.y.display = y;

    const [loading, setLoading] = useState<boolean>(true);
    const [options, setOptions] = useState<ChartOptions<'line'>>(defaultOptions);
    const [chart, setData] = useState<ChartData<'line'>>({ labels: [], datasets: [] });
    useEffect(() => {
        setLoading(true);
        console.time('index');
        refineData({
            data,
            num: 60,
            isBollinger: true,
        }).then((res) => {
            setData(res[0]);
            setLoading(false);
            console.timeEnd('index');
        });
        return () => {
            setLoading(true);
            setData({ labels: [], datasets: [] });
        }
    }, [])

    return (
        <div className='w-full h-full flex justify-center items-center'>
            {loading
                ? <Loading left={"auto"} right={"auto"} />
                : <Line
                    options={options}
                    plugins={plugins}
                    data={chart}
                />}
        </div>
    )
}

export default IndexLine;