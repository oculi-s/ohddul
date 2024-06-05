import styles from '$/Stock/Stock.module.scss';
import Help from "@/components/base/Help";
// import PriceLine from "#/chart/PriceLine";
import PriceLine from '@/components/chart/TradeChart';
import '@/module/array';
import { Color, Div, Per } from '@/module/ba';
import dt from '@/module/dt';
import { getMaData } from '@/module/filter/priceAvg';
import { bbHelp, maHelp } from './HelpDescription';

function MaTable({ stockPrice = [] }) {
    const price = Array.from(stockPrice)?.sort(dt.sort);
    const { last, avg20, avg60, avg120 } = getMaData(price);
    return <table className={styles.priceTable}>
        <tbody>
            <tr>
                <th rowSpan={2}>이동평균 지표<Help {...maHelp} /></th>
                <th>%20</th><th>%60</th><th>%120</th></tr>
            <tr>
                <td className={Color(avg20 - last)}>{Per(last, avg20)}</td>
                <td className={Color(avg60 - last)}>{Per(last, avg60)}</td>
                <td className={Color(avg120 - last)}>{Per(last, avg120)}</td>
            </tr>
        </tbody>
    </table>;
}

/**
 * %B 상승기준은 20%미만, 하락 기준은 80%이상
 * BW 변동성 기준은 5%
 */
function BBTable({ stockPrice = [] }) {
    const price = Array.from(stockPrice)?.sort(dt.sort);
    const { last,
        bot20, avg20, top20, pb20, bw20,
        bot60, avg60, top60, pb60, bw60,
        bot120, avg120, top120, pb120, bw120,
    } = getMaData(price);

    const pbColor = pb => pb < .2 ? 'red' : pb > .8 ? 'blue' : '';
    const bwClass = bw => bw < 0.05 ? 'bold' : '';

    return <table className={styles.priceTable}>
        <tbody>
            <tr>
                <th rowSpan={3}>BB지표<Help {...bbHelp} /></th>
                <th colSpan={2}>20</th>
                <th colSpan={2}>60</th>
                <th colSpan={2}>120</th>
            </tr>
            <tr>
                <th>%B</th><th>BW</th>
                <th>%B</th><th>BW</th>
                <th>%B</th><th>BW</th>
            </tr>
            <tr>
                <td className={pbColor(pb20)}>{Div(pb20, 1, 1)}</td>
                <td className={bwClass(bw20)}>{Div(bw20, 1, 1)}</td>
                <td className={pbColor(pb60)}>{Div(pb60, 1, 1)}</td>
                <td className={bwClass(bw60)}>{Div(bw60, 1, 1)}</td>
                <td className={pbColor(pb120)}>{Div(pb120, 1, 1)}</td>
                <td className={bwClass(bw120)}>{Div(bw120, 1, 1)}</td>
            </tr>
        </tbody>
    </table>;
}

const PriceElement = ({ stockPrice, load, setLoad }) => {
    return <>
        <h3>가격차트</h3>
        <div className={styles.priceChart}>
            <PriceLine price={stockPrice?.data} load={load} setLoad={setLoad} addEarn={true} />
        </div>
        <p className='des'>* 더블클릭시 전체화면으로 전환됩니다.</p>
        <h3>가격지표</h3>
        <div>
            <MaTable stockPrice={stockPrice?.data} />
            <BBTable stockPrice={stockPrice?.data} />
        </div>
    </>
}

export default PriceElement;