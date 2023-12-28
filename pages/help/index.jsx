import { useEffect, useRef } from 'react';
import styles from '$/Help/Help.module.scss';

import json from '@/module/json';
import ToC from '#/base/Toc';
import dir from '@/module/dir';

import { ToggleQuery } from '#/base/ToggleTab';
import DataInfo from '#/helpArticle/DataInfo';
import PredHowto from '#/helpArticle/PredHowto';
import Scoring from '#/helpArticle/Scoring';

import { useRouter } from 'next/router';
import Link from 'next/link';

/**
 * priceNull을 구할 때 서버에서 데이터를 전부 읽고 진행할지 고민인데
 * 그럴 필요 없음. 어차피 데이터가 제공되기는 하니까
 * 
 * 1. meta 서버로 넘기지 않음. SPAC과 notSPAC에서만 사용하는데 이걸 만들어서 넘겨줌 --> 데이터 92kb로 절약
 * 문제는 불러오는데에 시간이 너무 오래걸린다는 것. 업데이트 서버에서 미리 저장해두어야 함.
 * 2. 그래서 count 파일 따로 만듬. 데이터 1.94kb로 절약 시간도 매우 빠르게 개선
 */
export const getServerSideProps = async (ctx) => {
    const tab = ctx.query?.tab || 'base';

    const ban = json.read(dir.stock.ban);
    const count = json.read(dir.stock.light.count);
    const title = "오떨 사용방법";
    const props = { title, ...count, tab, ban };
    return { props };
}

export function Stock([code, name], i) {
    return <span key={i}><Link href={`/stock/${code}`}>{name}</Link>, </span>;
}

function Help({ aside, tab, cnt, earn, none, ban }) {
    const docsRef = useRef();
    const query = ['base', 'pred', 'score']//,'chart','community'];
    const names = ['기본정보', '예측방법', '고유점수']//, '차트보는법', '커뮤니티규칙'];
    return <>
        <ToC docsRef={docsRef} />
        <div className={styles.docs} ref={docsRef}>
            <span className={styles.title}>
                예측으로 얘기하자! 오르고 떨어지고, 오떨에 오신 여러분을 환영합니다.
            </span>
            <ToggleQuery {...{ query, names }} />
            {tab == 'base' ? <div>
                <DataInfo cnt={cnt} earn={earn} none={none} />
            </div> : tab == 'pred' ? <div>
                <PredHowto aside={aside} ban={ban} />
            </div> : tab == 'score' ? <div>
                <Scoring />
            </div> : <div>
                {/* <ChartHowto {...props} /> */}
                {/* <BoardRules {...props} /> */}
            </div>}
        </div>
    </>;
}

export default Help;