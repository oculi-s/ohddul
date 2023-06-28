import styles from '@/styles/Index.module.scss';
import { Per, Color, Num, Div } from '@/module/ba';
import dt from '@/module/dt';
import PriceChart from '@/component/chart/PriceLine';
import IndexChart from '@/component/chart/IndexLine';

const Kospi = ({ market, price, meta }) => {
    meta = meta?.data;
    if (!market) return;
    const { kospi, kosdaq } = market;
    kospi.sort(dt.sort);
    kosdaq.sort(dt.sort);
    const last = {
        kospi: kospi[0]?.c,
        kosdaq: kosdaq[0]?.c
    };
    const prev = {
        kospi: kospi[1]?.c,
        kosdaq: kosdaq[1]?.c
    };
    const kospiList = Object.keys(meta).filter(e => meta[e]?.t == "K");
    const kosdaqList = Object.keys(meta).filter(e => meta[e]?.t == "Q");
    const count = {
        all: {
            kospi: kospiList.length,
            kosdaq: kosdaqList.length
        },
        up: {
            kospi: kospiList.map(e => price[e]).filter(e => e?.c > e?.p).length,
            kosdaq: kosdaqList.map(e => price[e]).filter(e => e?.c > e?.p).length,
        },
        down: {
            kospi: kospiList.map(e => price[e]).filter(e => e?.c < e?.p).length,
            kosdaq: kosdaqList.map(e => price[e]).filter(e => e?.c < e?.p).length,
        }
    }
    return (
        <div className={`${styles.area} ${styles.chartArea}`}>
            <div className={styles.wrap}>
                <h3>
                    코스피&nbsp;
                    <span>{Num(last.kospi)}</span>&nbsp;
                    <span className={Color(last.kospi - prev.kospi)}>
                        ({Per(last.kospi, prev.kospi)})
                    </span>
                </h3>
                <div>
                    <span className={`fa fa-chevron-up red ${styles.fa}`} />
                    {count.up.kospi}
                    <span className={styles.percent}> ({Div(count.up.kospi, count.all.kospi)})</span>
                    <span className={`fa fa-chevron-down blue ${styles.fa}`} />
                    {count.down.kospi}
                    <span className={styles.percent}> ({Div(count.down.kospi, count.all.kospi)})</span>
                </div>
                <div className={styles.chart}>
                    <IndexChart {...{
                        price: kospi,
                        addBollinger: true,
                        N: 60,
                        axis: false,
                        legend: false,
                    }} />
                </div>
            </div>
            <div className={styles.wrap}>
                <h3>
                    코스닥&nbsp;
                    <span>{Num(last.kosdaq)}</span>&nbsp;
                    <span className={Color(last.kosdaq - prev.kosdaq)}>
                        ({Per(last.kosdaq, prev.kosdaq)})
                    </span>
                </h3>
                <div>
                    <span className={`fa fa-chevron-up red ${styles.fa}`} />
                    {count.up.kosdaq}
                    <span className={styles.percent}> ({Div(count.up.kosdaq, count.all.kosdaq)})</span>
                    <span className={`fa fa-chevron-down blue ${styles.fa}`} />
                    {count.down.kosdaq}
                    <span className={styles.percent}> ({Div(count.down.kosdaq, count.all.kosdaq)})</span>
                </div>
                <div className={styles.chart}>
                    <IndexChart {...{
                        price: kosdaq,
                        addBollinger: true,
                        N: 60,
                        axis: false,
                        legend: false,
                    }} />
                </div>
            </div>
        </div>
    )
}

export default Kospi;