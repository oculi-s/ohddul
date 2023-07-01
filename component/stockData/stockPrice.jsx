import styles from '@/styles/Stock/Stock.module.scss';
import Help from "#/base/Help";
import PriceLine from "#/chart/PriceLine";
import '@/module/array';
import { Color, Per } from '@/module/ba';
import { bbHelp, maHelp } from './HelpDescription';

const MaTable = ({ stockPrice }) => {
    const last = stockPrice?.slice(-1)[0].c;
    const avg20 = Math.avg(stockPrice?.slice(-20)?.map(e => e?.c));
    const avg60 = Math.avg(stockPrice?.slice(-60)?.map(e => e?.c));
    const avg120 = Math.avg(stockPrice?.slice(-120)?.map(e => e?.c));
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
    </table>
}

const BBTable = ({ stockPrice }) => {
    const avg60 = Math.avg(stockPrice?.slice(-60)?.map(e => e?.c));
    return <table className={styles.priceTable}>
        <tbody>
            <tr>
                <th rowSpan={2}>BB지표<Help {...bbHelp} /></th>
                <th colSpan={2}>20</th>
                <th colSpan={2}>60</th>
                <th colSpan={2}>120</th>
            </tr>
            <tr>
                <th>%B</th>
                <th>%BW</th>
                <th>%B</th>
                <th>%BW</th>
                <th>%B</th>
                <th>%BW</th>
            </tr>
            <tr><td></td></tr>
        </tbody>
    </table>
}

const PriceTable = (props) => {
    return <div>
        <MaTable {...props} />
        <BBTable {...props} />
    </div>
}

const PriceElement = (props) => {
    const { stockPrice, stockMeta } = props;
    const chartProps = {
        prices: [stockPrice],
        metas: [stockMeta],
    }
    return <>
        <h3>가격차트</h3>
        <div className={styles.priceChart}>
            <PriceLine {...chartProps} />
        </div>
        <h3>가격지표</h3>
        <PriceTable {...props} />
    </>
}

export default PriceElement;