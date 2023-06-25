import PriceChart from '@/component/chart/Price';
import styles from '@/styles/Index.module.scss';
import { Per, Color, Num, Div } from '@/module/ba';
import dt from '@/module/dt';
import ToggleTab from '@/component/base/tab';

const Kospi = ({ market, price, meta }) => {
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
            <p className='des'>기준일자 : {lastDate}</p>
        </div>
    )
}

const GroupBubble = ({ group }) => {
    const names = Object.keys(group)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5);
    const datas = names.map(name => {
        return;
    })
    return <div className={styles.area}>
        <h3>자산 상위 5대 그룹</h3>
        {ToggleTab({ names, datas })}
    </div>
}

const Column = () => {
    return <>
        - 칼럼 500자 이상<br />
        - 최신칼럼 / 인기칼럼<br />
        - 랭커들의 칼럼만 보기<br />
        - 좋아요 / 댓글 / 공유<br />
    </>
}

const GroupInduty = ({ group, price, meta, induty, index }) => {
    Object.keys(group)
        .filter(name => group[name].child?.length)
        .map(name => {
            const data = group[name].child;
            return data.map(code => {

            })
        })
    return <div className={styles.area}>
        <h3>그룹/업종 상승 순위</h3>
        <div className={styles.inline}>
            <div>
                <table><tbody>

                </tbody></table>
            </div>
            <div>
                <table><tbody>
                </tbody></table>
            </div>
        </div>
    </div>;
}

const index = function ({
    group, induty, index, market, price, meta
}) {
    group = group?.data;
    meta = meta?.data;
    return (
        <div>
            <Kospi {...{ market, price, meta }} />
            {/* <Column /> */}
            <GroupBubble {...{ group }} />
            <GroupInduty {...{ group, price, meta, induty, index }} />
        </div>
    )
}

import container, { getServerSideProps } from "@/pages/container";
export { getServerSideProps };
export default container(index);