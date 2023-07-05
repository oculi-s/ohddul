import Head from 'next/head'

export default function HEAD({ title }) {
    return (
        <Head>
            <title>{title || `오르고 떨어지고, 오떨`}</title>
            <meta name="description" content="예측으로 얘기하자! 오르고 떨어지고, 오떨" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no"></meta>
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@latest/css/font-awesome.min.css"></link>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1762696463079495"
                crossorigin="anonymous"></script>
        </Head>
    )
}