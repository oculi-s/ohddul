import { SessionProvider, getSession } from "next-auth/react"
import '$/main.scss'
import HEAD from "#/common/Head";
import Nav from "#/common/Nav";
import Aside from "#/common/Aside";
import Footer from "#/common/Footer";
import { useState } from "react";
import json from "@/module/json";
import dir from "@/module/dir";

export default function App({ Component, pageProps }) {
	const [mobAside, setAsideShow] = useState(false);
	pageProps = { ...pageProps, mobAside, setAsideShow };
	// useEffect(() => { getPageSize(); }, [])
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

App.getInitialProps = async function (ctx) {
	const aside = json.read(dir.stock.light.aside);
	const session = await getSession(ctx);
	const pageProps = { aside, session }
	return { pageProps }
}