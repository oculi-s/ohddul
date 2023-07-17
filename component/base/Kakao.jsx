import { signIn } from "next-auth/react";
import KakaoLogo from '@/public/kakao/KakaoLogo.svg';
import styles from '$/Base/Kakao.module.scss';

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
            <p>로그인하시면 주가예측과 관심종목 설정이 가능합니다.</p>
            <div>
                <KakaoLogin />
            </div>
        </div>
    </>
}