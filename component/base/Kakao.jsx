import { signIn } from "next-auth/react";
import KakaoLogo from '@/public/kakao/KakaoLogo.svg';
import styles from '$/Base/Kakao.module.scss';
import Link from "next/link";

export function KakaoLogin() {
    return <button
        className={styles.login}
        onClick={e => signIn('kakao')}
    >
        <div className={styles.inner}>
            <KakaoLogo />
            <div>
                <span>카카오 로그인</span>
            </div>
        </div>
    </button>
}

export function MustLogin() {
    return <>
        <div className={styles.must}>
            <h3>로그인이 필요한 서비스입니다.</h3>
            <p>로그인하시면 다음의 서비스를 이용할 수 있습니다.</p>
            <ul>
                <li>2500개 종목의 주가 예측</li>
                <li>관심종목 설정과 <Link href='/profile'>유저 페이지</Link>의 예측바를 통한 주가예측</li>
                <li><Link href='/board'>의견게시판</Link>에 의견 올리기</li>
            </ul>
            <div>
                <KakaoLogin />
            </div>
        </div>
    </>
}