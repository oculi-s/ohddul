import { SessionProvider, getSession } from "next-auth/react"
import '$/main.scss'
import HEAD from "#/common/Head";
import Nav from "#/common/Nav";
import Aside from "#/common/Aside";
import Footer from "#/common/Footer";
import { useEffect, useState } from "react";
import dir from "@/module/dir";
import json from "@/module/json";
import { getPageSize } from "#/base/base";
import App from 'next/app'

import asideStyles from '$/Common/Aside.module.scss';

const setAsideShow = () => {
	document?.querySelector('aside')?.classList?.toggle(asideStyles.show);
}

export default function Index({ Component, pageProps }) {
	pageProps = { ...pageProps, setAsideShow };
	useEffect(() => { getPageSize(); }, [])
	return (
		<SessionProvider session={pageProps.session}>
			<HEAD {...pageProps} />
			<Nav {...pageProps} />
			<Aside {...pageProps} />
			<main>
				<p style={{ color: 'red', fontStyle: 'italic' }}>오떨 업데이트 진행중 (~2024.06)</p>
				<p style={{ color: 'red', fontStyle: 'italic' }}>이전까지의 예측이 모두 사라집니다.</p>
				<ins className="kakao_ad_area" style={{ marginBottom: 10 }}
					data-ad-unit="DAN-x6nBfAkOv0q7zNPV"
					data-ad-width="320"
					data-ad-height="100"></ins>
				<Component {...pageProps} />
				<ins className="kakao_ad_area" style={{ marginTop: 10 }}
					data-ad-unit="DAN-LkuOjjZrAmsnaRfP"
					data-ad-width="320"
					data-ad-height="100"></ins>
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
	let aside = {}, ban = [];
	try {
		aside = json.read(dir.stock.light.aside);
		ban = json.read(dir.stock.ban);
	} catch { };
	const session = await getSession(ctx);
	const pageProps = { aside, session, ban }
	return { pageProps }
}
