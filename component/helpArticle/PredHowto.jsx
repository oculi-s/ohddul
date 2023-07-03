import styles from '$/Help.module.scss';
import { PredBar } from '#/stockData/stockHead';
import Image from 'next/image';
import helpImage from '@/public/help';
import Link from 'next/link';

function PredBlock1() {
    return <div className={styles.box}>
        <h3>예측바 열기</h3>
        <p>예측은 각 종목 페이지의 오른쪽 위에 있는 오떨맞추기 버튼을 눌러서 진행하실 수 있습니다.</p>
        <Image src={helpImage.pred1} alt='종목 예측 기본화면' />
        <p>버튼을 누르면 아래와 같은 예측바가 내려옵니다.</p>
        <Image src={helpImage.pred2} alt='예측바가 내려온 화면' />
        각 종목별 예측은 1일 1회 진행할 수 있습니다. 예측을 진행한 뒤에는 해당 종목의 예측바를 열 수 없도록 설정하였습니다.
    </div>;
}

function PredBlock2({ price }) {
    const code = '005930';
    const name = '삼성전자';
    return <div className={styles.box}>
        <h3>예측바 테스트하기</h3>
        아래는 <Link href='/stock/005930'>삼성전자</Link>의 테스트용 예측바입니다.
        <div className={styles.predWrap}>
            <PredBar {...{
                name,
                code, last: price[code], testing: true, help: false
            }} />
        </div>
        <p>오/떨 맞추기를 선택하시면 각각 오름과 떨어짐을, 가격 맞추기를 선택하시면 목표 가격을 맞추실 수 있습니다.</p>
        <h4>오/떨 맞추기</h4>
        <div className={styles.predWrap}>
            <PredBar {...{
                name,
                code, last: price[code], testing: true,
                defaultType: 1, help: false
            }} />
        </div>
        모든 오/떨에 대한 예측과 채점은 <span className='red'>1일 뒤</span>를 기준으로 합니다.<br />
        내일 해당 종목이 오르거나 떨어질지 여부를 예측해주시면 됩니다.<br />
        해당 종목의 뉴스를 미리 알고 예측하셔도 무방합니다. 뉴스를 아는 것도 실력입니다.
        <h4>가격 맞추기</h4>
        <div className={styles.predWrap}>
            <PredBar {...{
                name,
                code, last: price[code], testing: true,
                defaultType: 2, help: false
            }} />
        </div>
        목표가의 예측과 채점은 1일부터 최대 90일까지 가능합니다.<br />
        목표가는 최대 5배까지 예측할 수 있으며,

    </div>;
}

function PredBlock3() {
    return <div className={styles.box}>
        <h3>예측의 채점</h3>
        <p>모든 예측의 채점은 <span className='red'>예측이 일어난 날 자정</span>에 이루어집니다.</p>
    </div>

}

function PredHowto(props) {
    if (!props.meta) return <></>;
    return <div>
        <PredBlock1 {...props} />
        <PredBlock2 {...props} />
        <PredBlock3 {...props} />
    </div>;
}

export default PredHowto;