import styles from '@/styles/Index.module.scss';
import PriceChart from '@/component/chart/Price';
import { Per, Color, Num, Div } from '@/module/ba';
import dt from '@/module/dt';

const Kospi = ({ market, price, meta }) => {
    meta = meta?.data;
    if (!market) return;
    const { kospi, kosdaq } = market;
    kospi.sort(dt.sort);
    kosdaq.sort(dt.sort);
    const lastDate = kospi[0]?.date;
    const last = {
        kospi: kospi[0]?.close,
        kosdaq: kosdaq[0]?.close
    };
    const prev = {
        kospi: kospi[1]?.close,
        kosdaq: kosdaq[1]?.close
    };
    const kospiList = Object.keys(meta).filter(e => meta[e]?.type == "K");
    const kosdaqList = Object.keys(meta).filter(e => meta[e]?.type == "Q");
    const count = {
        all: {
            kospi: kospiList.length,
            kosdaq: kosdaqList.length
        },
        up: {
            kospi: kospiList.map(e => price[e]).filter(e => e?.close > e?.prev).length,
            kosdaq: kosdaqList.map(e => price[e]).filter(e => e?.close > e?.prev).length,
        },
        down: {
            kospi: kospiList.map(e => price[e]).filter(e => e?.close < e?.prev).length,
            kosdaq: kosdaqList.map(e => price[e]).filter(e => e?.close < e?.prev).length,
        }
    }
    return (
        <div className={`${styles.area} ${styles.chartArea}`}>
            <div className={styles.inline}>

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
                        <PriceChart {...{
                            prices: [kospi],
                            addEarn: false,
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
                        <PriceChart {...{
                            prices: [kosdaq],
                            addEarn: false,
                        }} />
                    </div>
                </div>
            </div>
            <p className='des'>기준일 : {lastDate}</p>
        </div>
    )
}

export default Kospi;