import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@latest/css/font-awesome.min.css"></link>
                {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1762696463079495"
                    crossOrigin="anonymous"></script> */}
                {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7774182904979409"
                    crossOrigin="anonymous"></script> */}
                <script type="text/javascript" src="//t1.daumcdn.net/kas/static/ba.min.js" async></script>
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-5HR5B3VVHB"></script>
		<script dangerouslySetInnerHTML={{
          		__html:`
		  	  window.dataLayer = window.dataLayer || [];
			  function gtag(){dataLayer.push(arguments);}
			  gtag('js', new Date());
			  gtag('config', 'G-5HR5B3VVHB');`}} 
		/>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
