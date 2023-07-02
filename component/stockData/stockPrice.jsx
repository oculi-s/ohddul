import styles from '@/styles/Stock/Stock.module.scss';
import Help from "#/base/Help";
import PriceLine from "#/chart/PriceLine";
import { Color, Div, Per } from '@/module/ba';
import { bbHelp, maHelp } from './HelpDescription';
import { getMaData } from '@/module/editData/priceAvg';
import '@/module/array';

function MaTable({ stockPrice }) {
    const { last, avg20, avg60, avg120 } = getMaData(stockPrice);
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

function BBTable({ stockPrice }) {
    const { last,
        bot20, avg20, top20,
        bot60, avg60, top60,
        bot120, avg120, top120
    } = getMaData(stockPrice);

    return <table className={styles.priceTable}>
        <tbody>
            <tr>
                <th rowSpan={3}>BB지표<Help {...bbHelp} /></th>
                <th colSpan={2}>20</th>
                <th colSpan={2}>60</th>
                <th colSpan={2}>120</th>
            </tr>
            <tr>
                <th>%B</th><th>%BW</th>
                <th>%B</th><th>%BW</th>
                <th>%B</th><th>%BW</th>
            </tr>
            <tr>
                <td>{Div(last - bot20, top20 - bot20, 1)}</td><td>{Div(top20 - bot20, avg20, 1)}</td>
                <td>{Div(last - bot60, top60 - bot60, 1)}</td><td>{Div(top60 - bot60, avg60, 1)}</td>
                <td>{Div(last - bot120, top120 - bot120, 1)}</td><td>{Div(top120 - bot120, avg120, 1)}</td>
            </tr>
        </tbody>
    </table>;
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
        <div>
            <MaTable {...props} />
            <BBTable {...props} />
        </div>
    </>
}

export default PriceElement;