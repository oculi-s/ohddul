import { SessionProvider } from "next-auth/react"
import '$/main.scss'

export default function App({ Component, pageProps }) {
	return (
		<SessionProvider session={pageProps.session}>
			<Component {...pageProps} />
		</SessionProvider>
	)
}