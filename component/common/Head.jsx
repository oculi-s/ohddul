import Head from 'next/head'
import Script from 'next/script';

export default function HEAD({ title }) {
    return (
        <Head>
            <title>{title || `오르고 떨어지고, 오떨`}</title>
            <meta name="description" content="주식을 예측하고 랭크를 매기는 커뮤니티, 오떨에 오신 것을 " />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no"></meta>
            {/* 카카오 공유 */}
            <meta property="og:title" content="오르고 떨어지고, 오떨" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="/mstile-310x310.png" />
            <meta property="og:description" content="주식을 예측하고 랭크를 매기는 커뮤니티" />
            {/* 파비콘 */}
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/apple-touch-icon-57x57.png" />
            <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/apple-touch-icon-114x114.png" />
            <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/apple-touch-icon-72x72.png" />
            <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/apple-touch-icon-144x144.png" />
            <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/apple-touch-icon-60x60.png" />
            <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/apple-touch-icon-120x120.png" />
            <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/apple-touch-icon-76x76.png" />
            <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/apple-touch-icon-152x152.png" />
            <link rel="icon" type="image/png" href="/favicon-196x196.png" sizes="196x196" />
            <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
            <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
            <link rel="icon" type="image/png" href="/favicon-128.png" sizes="128x128" />
            <link rel="manifest" href="/site.webmanifest" />
            {/* <link rel="manifest" href="/manifest.json" /> */}
            <meta name="application-name" content="ohddul" />
            <meta name="theme-color" content="#ffffff" />
            <meta name="msapplication-TileColor" content="#2b5797" />
            <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
            <meta name="msapplication-square70x70logo" content="/mstile-70x70.png" />
            <meta name="msapplication-square150x150logo" content="/mstile-150x150.png" />
            <meta name="msapplication-wide310x150logo" content="/mstile-310x150.png" />
            <meta name="msapplication-square310x310logo" content="/mstile-310x310.png" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@latest/css/font-awesome.min.css"></link>
            <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1762696463079495"
                crossorigin="anonymous"></Script>
        </Head>
    )
}