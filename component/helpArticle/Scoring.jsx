import styles from '$/Help.module.scss';
import { InlineMath as IM, BlockMath as BM } from 'react-katex';
import Link from 'next/link';

function ScoringBlock1() {
    return <div className={styles.box}>
        <h3>채점과 단위점수</h3>
        <p>모든 예측의 채점은 <span className='red'>데이터 업데이트 이후</span> 30분 이내로 이루어집니다. 오후 5시 이내에 모든 채점이 끝납니다.</p>
        <h4>오/떨 예측</h4>
        <p>오/떨 예측의 채점은 단순히 맞았는지 여부를 통해 진행합니다.</p>
        <table><tbody>
            <tr><th className='red'>O</th><td>오/떨이 맞은 경우</td></tr>
            <tr><th className='blue'>X</th><td>오/떨이 틀린 경우</td></tr>
        </tbody></table>
        <p>오/떨 예측의 단위 점수는 다음과 같이 계산됩니다.</p>
        <table><tbody>
            <tr><th>계산식</th><td><IM math='v=p\times\dfrac{1}{1+\sqrt{N/T}}' /></td></tr>
            <tr><th>변수</th><td>
                <p><IM>p</IM> = 정답 여부 (1은 정답, -1은 오답)</p>
                <p><IM>N</IM> = (해당종목의 본인의 예측을 제외한 당일 예측 수)</p>
                <p><IM>T</IM> = (해당일자의 본인의 예측을 제외한 전체 예측 수)</p>
            </td></tr>
        </tbody></table>
        <p>기본점수는 1점입니다. 만약 해당 종목을 예측한 사람이 많아지면 예측을 맞았을 때 얻는 점수가 줄어들게 됩니다.</p>
        <h4>오/떨 예측 예시</h4>
        <p>예를들어 오늘 <Link href={`/stock/005930`}>삼성전자</Link>를 3명이 예측하고, <Link href={`/stock/066570`}>LG전자</Link>를 5명이 예측하였습니다. 이때 내가 LG전자와 삼성전자를 모두 예측하고 삼성전자를 맞고, LG전자를 틀렸다면 점수 계산은 아래와 같이 진행됩니다.</p>
        <table><tbody>
            <tr><th></th><th>삼성전자</th><th>LG전자</th></tr>
            <tr><th><IM>T</IM></th><td colSpan={2}>3 (삼성전자) + 5 (LG전자) - 2 (본인의 예측) = 6</td></tr>
            <tr><th><IM>p</IM></th><td>1</td><td>-1</td></tr>
            <tr><th><IM>N</IM></th><td>3 (삼성전자) - 1 (본인) = 2</td><td>5 (LG전자) - 1 (본인) = 4</td></tr>
            <tr>
                <th><IM>v</IM></th>
                <td><IM math='1\times\dfrac{1}{1+\sqrt{2/6}}=0.63' /></td>
                <td><IM math='-1\times\dfrac{1}{1+\sqrt{4/6}}=-0.55' /></td>
            </tr>
            <tr><th><IM math='\triangle{v}' /></th><td colSpan={2}>0.63 - 0.55 = 0.08 (최종 점수 변화)</td></tr>
        </tbody></table>
        <p>따라서 당일 최대한 <span className='red'>적은 사람이 예측한 종목을 예측하는 것</span>이 점수를 올리는 데에 도움이 됩니다.</p>
        <p>점수 변화가 너무 적을것 같다면, 하루 예측 횟수에 제한이 없다는 것을 기억하셔야 합니다. 내일의 상황을 정확히 예측할 수만 있다면 하루에 점수는 끝없이 오를 수 있습니다.</p>
        <h4>가격 예측</h4>
        <p>가격 예측의 채점은 예측한 날짜의 가격과 예측 가격의 차이가 적을수록 더 높은 점수를 받습니다.</p>
        <p>가격 예측의 단위 점수는 다음과 같이 계산됩니다.</p>
        <table><tbody>
            <tr><th>계산식</th><td><IM math='v=\dfrac{|p-s|}{}' /></td></tr>
        </tbody></table>
        <h4>가격 예측 예시</h4>
    </div>
}

function ScoringBlock2() {
    return <div className={styles.box}>
        <h3>유저의 고유 점수</h3>
        <p>유저의 고유 점수는 다음과 같이 산정됩니다.</p>
        <table><tbody>
            <tr><th>기본점수</th><td>1000</td></tr>
            <tr><th>오/떨 점수</th><td></td></tr>
            <tr><th>가격 점수</th><td></td></tr>
        </tbody></table>
    </div>
}

function Scoring(props) {
    if (!props.meta) return <></>;
    return <div className={styles.scoring}>
        <ScoringBlock1 {...props} />
        <ScoringBlock2 {...props} />
    </div>;
}

export default Scoring;