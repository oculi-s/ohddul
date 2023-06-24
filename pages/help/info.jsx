import Link from "next/link";
import dt from '@/module/dt';
import Help from '@/component/base/help';
import styles from '@/styles/Help.module.scss';
import { Div } from '@/module/ba';

const InfoBlock1 = ({
    meta, price,
    earnNull, earnCount, shareNull
}) => {
    const count = Object.keys(meta).length
    const priceCount = Object.keys(meta).filter(e => price[e]).length;
    const YEARS = dt.YEARS();
    const len = YEARS.length;
    return <div className={styles.box}>
        <h3>데이터 정보</h3>
        <h4>제공데이터</h4>
        전체 {count}개의 종목에 대한 정보가 제공되고 예측이 가능합니다.
        <table><tbody>
            <tr>
                <th>가격</th>
                <td>
                    <span className='red'>{priceCount}</span>
                    ({Div(priceCount, count)}) 개 종목의 가격정보가 제공됩니다.
                </td>
            </tr>
            <tr>
                <th>실적</th>
                <td>
                    <span className='red'>{count - earnNull.length}</span>
                    ({Div(count - earnNull.length, count)}) 개 종목의 실적정보가 제공됩니다.
                </td>
            </tr>
            <tr>
                <th>지분</th>
                <td>
                    <span className='red'>{count - shareNull.length}</span>
                    ({Div(count - shareNull.length, count)}) 개 종목의 지분정보가 제공됩니다.
                </td>
            </tr>
        </tbody></table>
        모든 가격 정보는 <span className="red">전일 종가</span>를 기준으로 제공됩니다.
        <h4>실적데이터 상세</h4>
        실적은 별도재무제표 기준이며, 10년치 데이터가 다음과 같이 제공됩니다.
        외부에서 제공되지 않는 2014년 데이터와 아직 발표되지 않은 실적 정보는 확인하실 수 없습니다.
        <div className={styles.inline}>
            <table><tbody>
                {YEARS.slice(0, len / 2).map(year => {
                    const yearCount = earnCount[year];
                    return <tr key={year}><th>{year}</th>
                        {yearCount.map((c, i) => (
                            <td key={`${year}_${i}`}>
                                <span>{i + 1}Q <span className={styles.per}>({Div(c, count)})</span></span>
                                <div className={styles.bar} style={{ width: Div(c, count) }}></div>
                            </td>
                        ))}
                    </tr>
                })}
            </tbody></table>
            <table><tbody>
                {YEARS.slice(len / 2).map(year => {
                    const yearCount = earnCount[year];
                    return <tr key={year}><th>{year}</th>
                        {yearCount.map((c, i) => (
                            <td key={`${year}_${i}`}>
                                <span>{i + 1}Q <span className={styles.per}>({Div(c, count)})</span></span>
                                <div className={styles.bar} style={{ width: Div(c, count) }}></div>
                            </td>
                        ))}
                    </tr>
                })}
            </tbody></table>
        </div>
        <h4>업데이트</h4>
        <p>데이터 업데이트는 매일 자정부터 30분 이내로 이루어집니다.</p>
        <p>데이터는 <Link href='https://opendart.fss.or.kr' target='blank'>openDart</Link>와 <Link href='https://data.go.kr' target='blank'>공공데이터포털</Link>을 이용합니다.</p>
    </div>
}

const InfoBlock2 = ({ meta, price }) => {
    const priceNull = Object.keys(meta).filter(e => !price[e]);
    const SPAC = priceNull.filter(e => meta[e]?.name?.includes('스팩'));
    const notSPAC = priceNull.filter(e => !meta[e]?.name?.includes('스팩'));
    return <div className={styles.box}>
        <h3>가격정보가 제공되지 않은 종목 ({priceNull.length}개)</h3>
        <h4>합병이 예정된 스팩주
            <Help span={<>
                <p>기업인수목적회사</p>
                <p>2000억의 시총을 가지고 비상장 회사를 물색하여
                    회사의 지분을 매입한 뒤 사명을 변경하는 방식으로
                    우회상장하는 목적으로 설립된 회사</p>
            </>} /> ({SPAC.length}개)</h4>
        {
            SPAC.map(code =>
                <span key={code}>
                    <Link href={`/stock/${code}`}>{meta[code].name}</Link>,
                    &nbsp;
                </span>
            )
        }
        < h4 > 거래불가({notSPAC.length}개)</h4>
        {notSPAC.map(code =>
            <span key={code}>
                <Link href={`/stock/${code}`}>{meta[code].name}</Link>,
                &nbsp;
            </span>
        )}
    </div>
}

const Info = (props) => {
    const meta = props?.meta?.data;
    if (!meta) return <></>;
    props = { ...props, meta };
    return <div>
        <InfoBlock1 {...props} />
        <InfoBlock2 {...props} />
    </div>
};

export default Info;