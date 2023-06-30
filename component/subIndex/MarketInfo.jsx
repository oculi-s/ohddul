import styles from '@/styles/Index.module.scss';
import { Per, Color, Num, Div } from '@/module/ba';
import dt from '@/module/dt';
import PriceLine from '#/chart/PriceLine';

const Kospi = ({ last, prev, count, kospi }) => {
    return <div className={styles.wrap}>
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
            <PriceLine {...{
                prices: [kospi],
                metas: [{ 'name': 'kospi' }],
                addBollinger: true,
                N: 60,
            }} />
        </div>
    </div>
}

const Kosdaq = ({ last, prev, count, kosdaq }) => {
    return <div className={styles.wrap}>
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
            <PriceLine {...{
                prices: [kosdaq],
                metas: [{ 'name': 'kosdaq' }],
                addBollinger: true,
                N: 60,
            }} />
        </div>
    </div>

}

const Market = ({ market, price, meta }) => {
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
    const props = { last, prev, count, kospi, kosdaq };
    return (
        <div className={`${styles.area} ${styles.chartArea}`}>
            <Kospi {...props} />
            <Kosdaq {...props} />
        </div>
    )
}

export default Market;