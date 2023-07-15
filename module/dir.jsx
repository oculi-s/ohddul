import encode from '@/module/alias';

export const stock = {
    ban: encode('_/ban.json'),
    all: encode('_/price.json'),
    hist: encode('_/hist.json'),
    code: encode('_/code.json'),
    crno: encode('_/crno.json'),
    name: encode('_/name.json'),
    meta: encode('_/meta.json'),
    date: encode('_/date.json'),
    group: encode('_/group.json'),
    market: encode('_/market.json'),
    induty: encode('_/index.json'),
    predAll: encode('_/predict.json'),
    price: code => encode(`&/${code}/price.json`),
    earn: code => encode(`&/${code}/earn.json`),
    share: code => encode(`&/${code}/share.json`),
    pred: code => encode(`#/${code}.json`),
    major: name => encode(`@/data/share/${name}.json`),
    light: {
        aside: encode('_/light/aside.json'),
        market: encode('_/light/market.json'),
        price: code => encode(`&/${code}/priceClose.json`),
        earn: code => encode(`&/${code}/earnFixed.json`),
        count: encode('_/light/count.json'),
        tree: encode('_/light/tree.json'),
        updown: encode('_/light/updown.json'),
        group: encode('_/light/group.json'),
        ratio: encode('_/light/ratio.json'),
    },
    dart: {
        induty: encode('_/induty.json'),
        xml: encode('_/CORPCODE.xml'),
        list: encode('_/dart.json'),
    }
}

export const user = {
    ids: encode('@/data/user/ids.json'),
    meta: uid => encode(`@/data/user/${uid}/meta.json`),
    favs: uid => encode(`@/data/user/${uid}/favs.json`),
    pred: uid => encode(`@/data/user/${uid}/pred.json`),
    hist: uid => encode(`@/data/user/${uid}/hist.json`),
    alarm: uid => encode(`@/data/user/${uid}/alarm.json`),
}

export const board = {
    ideas: encode('@/data/board/meta/idea.json'),
    idea: uid => encode(`@/data/board/idea/${uid}.json`)
}

export default { stock, user, board };