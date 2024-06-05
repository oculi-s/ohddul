import styles from '$/Help/Help.module.scss';
import { Collapse } from '@/components/base/base';
import Help from '@/components/base/Help';
import PredBar from '@/components/baseStock/PredBar';
import { H3, H4 } from '@/module/help/header';
import { Stock } from '@/pages/help';
import helpImage from '@/public/help';
import Image from 'next/image';
import Link from 'next/link';

function PredBlock1() {
    return <div className={`${styles.box} ${styles.predImage}`}>
        <p>전체 예측 횟수는 제한이 없으며, 종목별로는 하루 1회가 가능합니다.</p>
        <H3>예측바 열기</H3>
        <p>예측은 각 종목 페이지의 오른쪽 위에 있는 오떨맞추기 버튼을 눌러서 진행하실 수 있습니다.</p>
        <Image src={helpImage.pred1} alt='종목 예측 기본화면' />
        <p>버튼을 누르면 아래와 같은 예측바가 내려옵니다.</p>
        <Image src={helpImage.pred2} alt='예측바가 내려온 화면' />
        <p>모든 예측은 <span className='red'>로그인된 사용자</span>만 이용할 수 있습니다.</p>
        <p>각 종목별 예측은 1일 1회 진행할 수 있습니다. 예측을 진행한 뒤에는 해당 종목의 예측바를 열 수 없습니다.</p>
    </div>;
}

function PredBlock2({ aside }) {
    const first = aside?.sum?.find(e => true);
    const code = first?.code;
    const name = first?.n;
    const last = first?.c;
    return <div className={styles.box}>
        <H3>예측바 테스트하기</H3>
        아래는 <Link href={`/stock/${code}`}>{name}</Link>의 테스트용 예측바입니다.
        <div className={styles.predBarWrap}>
            <PredBar {...{
                name, code, last, testing: true, help: false
            }} />
        </div>
        {/* <p>오/떨 맞추기를 선택하시면 각각 오름과 떨어짐을, 가격 맞추기를 선택하시면 목표 가격을 맞추실 수 있습니다.</p> */}
        <H4>오/떨 맞추기</H4>
        <div className={styles.predBarWrap}>
            <PredBar {...{
                name, code, last, testing: true,
                defaultType: 1, help: false
            }} />
        </div>
        {/* PC버전에서는 F9, F10을 이용해 빠르게 예측을 진행할 수 있습니다. (준비중입니다.)
        <H4>가격 맞추기</H4>
        <div className={styles.predBarWrap}>
            <PredBar {...{
                name, code, last, testing: true,
                defaultType: 2, help: false
            }} />
        </div>
        <p>목표가의 예측은 다음 영업일부터 최대 90일 후까지 가능하며, <span className='red'>최대 5배</span>까지 예측할 수 있습니다.</p> */}
    </div>
}

function PredBlock3() {
    return <div className={styles.box}>
        <H3>예측의 채점시간</H3>
        <Image src={helpImage.pred3} alt='예측 시간' />
        <p>오/떨을 예측할 때는 일반적으로 <span className='red'>다음 종가</span>를 예측 해주시면 됩니다.</p>
        <p>아직 장이 시작되기 전에는 해당일자의 주가 예측이 가능합니다. 하지만 장이 시작된 이후에는 다음 영업일의 종가를 예측해야 합니다.</p>
        <table className='fixed'>
            <thead>
                <tr><th>예측시간</th><th>예측 기준일 (채점시간)</th></tr>
            </thead>
            <tbody>
                <tr>
                    <th>
                        <p>장 시작 전</p>
                        <p>(00:00~08:59)</p>
                    </th>
                    <td>당일 장 마감 후</td>
                </tr>
                <tr>
                    <th>
                        <p>장 시작 후</p>
                        <p>(09:00~23:59)</p>
                    </th>
                    <td>다음 영업일 장 마감 후</td></tr>
                <tr>
                    <th>
                        <p>금요일 장후~월요일 장전</p>
                    </th>
                    <td>월요일 장 마감 후</td>
                </tr>
            </tbody>
        </table>
        <Collapse title={'예측 시간 예시'}>
            <p>5개의 예측을 했고, 각각의 시간이 아래와 같다면 예측의 채점 시간은 아래와 같습니다.</p>
            <table>
                <thead align='center'><tr><th>예측시간</th><th>채점시간</th><th>-</th></tr></thead>
                <tbody>
                    <tr><th>월 07:00</th><td>월 15:30</td><td>장전에 예측했으니 당일 장후 채점</td></tr>
                    <tr><th>월 09:30</th><td>화 15:30</td><td>장중에 예측했으니 다음날 장후 채점</td></tr>
                    <tr><th>월 16:00</th><td>화 15:30</td><td>장후에 예측했으니 다음날 장후 채점</td></tr>
                    <tr><th>금 09:10</th><td>월 15:30</td><td>금요일 장중에 예측했으니 월요일 장후 채점</td></tr>
                    <tr><th>토 12:00</th><td>월 15:30</td><td>주말에 예측했으니 월요일 장 후 채점</td></tr>
                </tbody>
            </table>
        </Collapse>
        <p>대형주 쏠림을 방지하기 위해 당일 많은 사람이 맞춘 종목은 더 적은 점수를 받게 됩니다. <Link href={{ query: { tab: 'score' } }}>오떨의 점수산정 방식 보러가기</Link></p>
    </div>
}

function PredBlock4({ ban }) {
    ban = Object.entries(ban);
    const SPAC = ban?.filter(e => e[1]?.includes('스팩'));
    const notSPAC = ban?.filter(e => !e[1]?.includes('스팩'));
    return <div className={styles.box}>
        <H3>예측이 불가능한 종목 ({ban.length}개)</H3>
        거래정지 주식, 혹은 가격 데이터가 불완전한 종목은 가격변화가 없기 때문에 가격을 예측할 수 없습니다.
        <H4>합병이 예정된 스팩주<Help
            title={'기업인수목적회사'}
            span={<>
                2000억의 시총을 가지고 비상장 회사를 물색하여
                회사의 지분을 매입한 뒤 사명을 변경하는 방식으로
                우회상장하는 목적으로 설립된 회사입니다.
            </>}
        /> ({SPAC?.length}개)
        </H4>
        <Collapse>{SPAC?.map(Stock)}</Collapse>
        <H4>기타 거래정지주 ({notSPAC?.length}개)</H4>
        <Collapse>{notSPAC?.map(Stock)}</Collapse>
    </div>
}

function PredHowto({ aside, ban }) {
    return <div>
        <PredBlock1 />
        <PredBlock2 aside={aside} />
        <PredBlock3 />
        <PredBlock4 ban={ban} />
    </div>;
}

export default PredHowto;