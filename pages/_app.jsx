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
				<Component {...pageProps} />
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