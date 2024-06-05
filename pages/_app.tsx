import '$/main.scss';
import { getPageSize } from "@/components/base/base";
import Footer from "@/components/common/Footer";
import MetaHead from "@/components/common/MetaHead";
import dir from "@/module/dir";
import json from "@/module/json";
import { SessionProvider, getSession } from "next-auth/react";
import { useEffect } from "react";
import './globals.css';

import Header from '#/common/Header';
import asideStyles from '$/Common/Aside.module.scss';
import Aside from '@/components/common/Aside';

const setAsideShow = () => {
	document?.querySelector('aside')?.classList?.toggle(asideStyles.show);
}

export default function Index({ Component, pageProps }) {
	pageProps = { ...pageProps, setAsideShow };
	useEffect(() => { getPageSize(); }, [])
	return (
		<SessionProvider session={pageProps.session}>
			<MetaHead {...pageProps} />
			<Header {...pageProps} />
			<main className='flex w-full justify-center mt-header mx-auto'>
				{/* <p style={{ color: 'red', fontStyle: 'italic' }}>오떨 업데이트 진행중 (~2024.06)</p>
				<p style={{ color: 'red', fontStyle: 'italic' }}>이전까지의 예측이 모두 사라집니다.</p> */}
				{/* <div>
					<ins className="kakao_ad_area" style={{ marginBottom: 10 }}
					data-ad-unit="DAN-x6nBfAkOv0q7zNPV"
					data-ad-width="320"
					data-ad-height="100" />
				</div> */}
				{/* <div>
					<ins className="kakao_ad_area" style={{ marginTop: 10 }}
					data-ad-unit="DAN-LkuOjjZrAmsnaRfP"
					data-ad-width="320"
					data-ad-height="100" />
				</div> */}
				<div className='flex-1'>
					<Component {...pageProps} />
				</div>
				<div className='w-aside max-lg:hidden'>
					<Aside {...pageProps} />
				</div>
			</main>
			<Footer />
		</SessionProvider>
	)
}

/**
 * getInitialProps가 client와 server를 연결하는 함수라서 json.read에 오류가 뜸
 * 일단 trycatch를 썼는데 수정 필요
 */
Index.getInitialProps = async function (ctx) {
	let ban = [];
	try {
		ban = json.read(dir.stock.ban);
	} catch { };
	const session = await getSession(ctx);
	const pageProps = { session, ban }
	return { pageProps }
}
