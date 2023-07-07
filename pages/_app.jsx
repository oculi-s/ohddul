import { SessionProvider } from "next-auth/react"
import '$/main.scss'
import HEAD from "#/common/Head";
import Nav from "#/common/Nav";
import Aside from "#/common/Aside";
import Footer from "#/common/Footer";
import { getPageSize } from "#/base/base";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
	const [mobAside, setAsideShow] = useState(false);
	pageProps = { ...pageProps, mobAside, setAsideShow };
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
