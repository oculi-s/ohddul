import { SessionProvider } from "next-auth/react"
import Script from 'next/script';
import '$/main.scss'

export default function App({ Component, pageProps }) {
	function kakaoInit() { // 페이지가 로드되면 실행
		window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
		console.log(window.Kakao.isInitialized());
	}
	return (
		<SessionProvider session={pageProps.session}>
			<Component {...pageProps} />
			<Script
				src='https://developers.kakao.com/sdk/js/kakao.js'
				onLoad={kakaoInit}
			></Script>
		</SessionProvider>
	)
}
