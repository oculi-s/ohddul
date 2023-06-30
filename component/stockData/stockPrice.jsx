import styles from '@/styles/Stock/Stock.module.scss';
import Help from "#/base/Help";
import PriceLine from "#/chart/PriceLine";
import '@/module/array';
import { Color, Per } from '@/module/ba';

const MaTable = ({ stockPrice }) => {
    const last = stockPrice?.slice(-1)[0].c;
    const avg20 = Math.avg(stockPrice?.slice(-20)?.map(e => e?.c));
    const avg60 = Math.avg(stockPrice?.slice(-60)?.map(e => e?.c));
    const avg120 = Math.avg(stockPrice?.slice(-120)?.map(e => e?.c));
    return <table className={styles.priceTable}>
        <tbody>
            <tr>
                <th rowSpan={2}>이동평균 지표
                    <Help
                        title={'Moving Average 이동평균 (이평)'}
                        span={`여러 일 간의 종가의 평균값을 낸 것입니다. 주로 60, 120일을 사용하며, 장단기 추세를 보는 데에 유리합니다. 이평보다 높으면 하락, 낮으면 상승 가능성이 높습니다.`}
                        data={<>
                            <tr><th>%20</th><td>(현재가 - 20일 이평) / 20일 이평</td></tr>
                            <tr><th>%60</th><td>(현재가 - 60일 이평) / 60일 이평</td></tr>
                            <tr><th>%120</th><td>(현재가 - 120일 이평) / 120일 이평</td></tr>
                        </>}
                    />
                </th>
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
                <th rowSpan={2}>BB지표
                    <Help
                        title={'Bollinger Band, 볼린저밴드'}
                        span={`이동평균을 이용한 밴드 지표`}
                    />
                </th>
                <th>%B<Help span={''} /></th>
                <th>%BW<Help span={''} /></th>
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
    // if (!stockPrice || !stockMeta) return;
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