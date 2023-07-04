import { useState } from 'react';
import styles from '$/Help.module.scss';

import json from '@/module/json';
import dt from '@/module/dt';
import ToC from '#/base/Toc';
import dir from '@/module/dir';

import ToggleTab from '#/base/ToggleTab';
import DataInfo from '#/helpArticle/DataInfo';
import PredHowto from '#/helpArticle/PredHowto';
import BoardRules from '#/helpArticle/BoardRules';
import Scoring from '#/helpArticle/Scoring';

import Container from '@/container/light';

/**
 * priceNull을 구할 때 서버에서 데이터를 전부 읽고 진행할지 고민인데
 * 그럴 필요 없음. 어차피 데이터가 제공되기는 하니까
 * 
 * 1. meta 서버로 넘기지 않음. SPAC과 notSPAC에서만 사용하는데 이걸 만들어서 넘겨줌 --> 데이터 92kb로 절약
 * 문제는 불러오는데에 시간이 너무 오래걸린다는 것. 업데이트 서버에서 미리 저장해두어야 함.
 * 2. 그래서 count 파일 따로 만듬. 데이터 1.94kb로 절약 시간도 매우 빠르게 개선
 */
export const getServerSideProps = async (ctx) => {
    const now = dt.num();
    const aside = json.read(dir.stock.light.aside);
    const count = json.read(dir.stock.light.count);
    const props = {
        now, aside, ...count
    };
    return { props };
}


const Index = (props) => {
    const [tabIndex, setTabIndex] = useState(0);
    props = { ...props, setTabIndex };
    const names = ['기본정보', '예측방법', '점수산정', '차트보는법', '커뮤니티규칙'];
    const datas = [
        <div key={0}>
            <DataInfo {...props} />
        </div>,
        <div key={1}>
            <PredHowto {...props} />
        </div>,
        <div key={2}>
            <Scoring />
        </div>,
        <div key={3}>
            {/* <ChartHowto {...props} /> */}
            <BoardRules {...props} />
        </div>
    ]
    return <>
        <ToC tabIndex={tabIndex} />
        <div className={styles.docs}>
            <span className={styles.title}>
                예측으로 얘기하자! 오르고 떨어지고, 오떨에 오신 여러분을 환영합니다.
            </span>
            <ToggleTab {...{ names, datas, tabIndex, setTabIndex }} />
        </div>
    </>
}

export default Container(Index);