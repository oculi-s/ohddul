import 애경 from './AK.svg';
import BGF from './BGF.svg';
import CJ from './CJ.svg';
import DB from './DB.svg';
import DL from './DL.svg';
import DN from './DN.svg';
import 유진 from './Eugene.svg';
import 한국지엠 from './GM.svg';
import GS from './GS.svg';
import 하림 from './Halim.svg';
import 한진 from './Hanjin.svg';
import HDC from './HDC.svg';
import HD현대 from './HD현대.svg';
import HL from './HL.svg';
import HMM from './HMM.svg';
import IS from './IS.svg';
import 하이트진로 from './Jinro.svg';
import KCC from './KCC.svg';
import KG from './KG.svg';
import KTG from './KT&G.svg';
import KT from './KT.svg';
import LG from './LG.svg';
import LS from './LS.svg';
import LX from './LX.svg';
import MDM from './MDM.svg';
import OCI from './OCI.svg';
import OK금융그룹 from './OK금융그룹.svg';
import POSCO from './POSCO.svg';
import SOil from './S-OIL.svg';
import SK from './SK.svg';
import SM from './SM.svg';
import 고려HC from './고려HC.svg';
import 교보생명보험 from './교보생명보험.svg';
import 글로벌세아 from './글로벌세아.svg';
import 금호석유화학 from './금호석유화학.svg';
import 금호아시아나 from './금호아시아나.svg';
import 네이버 from './네이버.svg';
import 넥슨 from './넥슨.svg';
import 넷마블 from './넷마블.svg';
import 농심 from './농심.svg';
import 농협 from './농협.svg';
import 다우키움 from './다우키움.svg';
import 대방건설 from './대방건설.svg';
import 동국제강 from './동국제강.svg';
import 동원 from './동원.svg';
import 두나무 from './두나무.svg';
import 두산 from './두산.svg';
import 롯데 from './롯데.svg';
import 미래에셋 from './미래에셋.svg';
import 반도 from './반도.svg';
import 보성 from './보성.svg';
import 부영 from './부영.svg';
import 삼성 from './삼성.svg';
import 삼양 from './삼양.svg';
import 삼천리 from './삼천리.svg';
import 삼표 from './삼표.svg';
import 세아 from './세아.svg';
import 셀트리온 from './셀트리온.svg';
import 신세계 from './신세계.svg';
import 신영 from './신영.svg';
import 아모레퍼시픽 from './아모레퍼시픽.svg';
import 에코프로 from './에코프로.svg';
import 영풍 from './영풍.svg';
import 이랜드 from './이랜드.svg';
import 장금상선 from './장금상선.svg';
import 중앙 from './중앙.svg';
import 중흥건설 from './중흥건설.svg';
import 카카오 from './카카오.svg';
import 코오롱 from './코오롱.svg';
import 쿠팡 from './쿠팡.svg';
import 크래프톤 from './크래프톤.svg';
import 태광 from './태광.svg';
import 태영 from './태영.svg';
import 한국타이어 from './한국타이어.svg';
import 한국항공우주산업 from './한국항공우주산업.svg';
import 한솔 from './한솔.svg';
import 한화 from './한화.svg';
import 현대백화점 from './현대백화점.svg';
import 현대차 from './현대차.svg';
import 호반건설 from './호반건설.svg';
import 효성 from './효성.svg';
// import 대우조선해양 from './대우조선해양.svg';

const groupImg = {
    삼성, SK, 현대차, LG, POSCO, 롯데, 한화,
    GS, HD현대, 농협, 신세계, KT, CJ, 한진,
    카카오, LS, 두산, DL, HMM, 중흥건설, 현대백화점,
    부영, 네이버, 미래에셋, 금호아시아나, 하림,
    영풍, HDC, SM, 효성, 셀트리온, 호반건설,
    KCC, 장금상선, OCI, 코오롱, 태영, 넷마블, 세아, 넥슨, LX,
    쿠팡, 이랜드, 한국타이어, DB, 삼천리, 금호석유화학,
    태광, 교보생명보험, 동원, KG, HL, 아모레퍼시픽,
    한국항공우주산업, 대방건설, 중앙, 두나무, 에코프로,
    애경, 한국지엠, 동국제강, MDM, 삼양, 크래프톤,
    고려HC, 보성, 글로벌세아, 신영, DN, OK금융그룹,
    IS, 하이트진로, 한솔, 유진, 농심, 삼표, 반도, BGF,
    다우키움,
    // 대우조선해양,
};
groupImg["KT&G"] = KTG;
groupImg["S-Oil"] = SOil;

export default function GroupImg({ name, className }: {
    name: string, className?: string
}) {
    if (!groupImg[name]) return;
    return <div className={className}>{groupImg[name]({ style: { maxHeight: '100%', maxWidth: '100%' } })}</div>
};
