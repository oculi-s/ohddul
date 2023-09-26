import styles from '$/Index.module.scss';
import { Per, Color, Num, Div, Fix, parseFix } from '@/module/ba';
import dt from '@/module/dt';
import { getMaData } from '@/module/filter/priceAvg';
import IndexLine from '#/chart/IndexLine';

function Index({ data, last, prev, count, name }) {
    const { avg60, top60, bot60 } = getMaData(data);
    last = last[name];
    prev = prev[name];
    return <div className={styles.wrap}>
        <h3 className={styles.title}>
            {name == 'kospi' ? '코스피' : '코스닥'}&nbsp;
            <span>{parseFix(last, 1)}</span>&nbsp;
            <span className={`${Color(last - prev)} ${styles.percent}`}>
                ({Per(last, prev)})
            </span>
        </h3>
        <div className={styles.updown}>
            <span className={`fa fa-chevron-up red ${styles.fa}`} />
            {count?.up[name]}
            <span className={styles.percent}> ({Div(count?.up[name], count?.all[name])})</span>
            <span className={`fa fa-chevron-down blue ${styles.fa}`} />
            {count?.down[name]}
            <span className={styles.percent}> ({Div(count?.down[name], count?.all[name])})</span>
        </div>
        <div className={styles.chart}>
            <IndexLine {...{
                data, addBollinger: true,
            }} />
        </div>
        <table><tbody>
            <tr>
                <th>%B</th>
                <td>{Div(last - bot60, top60 - bot60, 1)}</td>
                <th>BW</th>
                <td>{Div(top60 - bot60, last, 1)}</td>
            </tr>
        </tbody></table>
    </div>
}

const Market = ({ market, count }) => {
    if (!market) return;
    const kospi = market?.kospi?.qsort(dt.sort);
    const kosdaq = market?.kosdaq?.qsort(dt.sort);
    const last = { kospi: kospi[0]?.c, kosdaq: kosdaq[0]?.c };
    const prev = { kospi: kospi[1]?.c, kosdaq: kosdaq[1]?.c };
    const props = { last, prev, count };
    return (<>
        <article className={`${styles.area} ${styles.chartArea}`}>
            <div>
                <Index {...props} data={kospi} name={'kospi'} />
                <Index {...props} data={kosdaq} name={'kosdaq'} />
            </div>
            <p className='des'>* 기준일 : {kospi[0]?.d}</p>
        </article>
    </>)
}

export default Market;