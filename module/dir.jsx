import encode from '@/module/alias';

export const stock = {
    ban: encode('_/ban.json'),
    all: encode('_/price.json'),
    hist: encode('_/hist.json'),
    code: encode('_/code.json'),
    crno: encode('_/crno.json'),
    meta: encode('_/meta.json'),
    date: encode('_/date.json'),
    group: encode('_/group.json'),
    child: encode('_/child.json'),
    market: encode('_/market.json'),
    induty: encode('_/index.json'),
    predAll: encode('_/pred.json'),
    price: code => encode(`&/${code}/price.json`),
    earn: code => encode(`&/${code}/earn.json`),
    share: code => encode(`&/${code}/share.json`),
    other: code => encode(`&/${code}/other.json`),
    pred: code => encode(`#/${code}.json`),
    major: name => encode(`d/share/${name}.json`),
    light: {
        aside: encode('_/light/aside.json'),
        market: encode('_/light/market.json'),
        price: code => encode(`&/${code}/priceClose.json`),
        earn: code => encode(`&/${code}/earnFixed.json`),
        share: code => encode(`&/${code}/shareFixed.json`),
        count: encode('_/light/count.json'),
        tree: encode('_/light/tree.json'),
        updown: encode('_/light/updown.json'),
        group: encode('_/light/group.json'),
        index: encode('_/light/index.json'),
        induty: encode('_/light/induty.json'),
        ratio: encode('_/light/ratio.json'),
    },
    chart: {
        price: (code, num = 20) => encode(`&/${code}/priceChart${num}.json`),
        group: (name, num = 20) => encode(`d/group/${name}/priceChart${num}.json`),
        share: (name) => encode(`d/group/${name}/shareChart.json`),
    },
    groups: {
        price: (name) => encode(`d/group/${name}/price.json`),
        share: (name) => encode(`d/group/${name}/share.json`),
    },
    dart: {
        induty: encode('_/induty.json'),
        xml: encode('_/CORPCODE.xml'),
        list: encode('_/dart.json'),
    }
}

export const user = {
    ids: encode('d/user/ids.json'),
    meta: uid => encode(`d/user/${uid}/meta.json`),
    favs: uid => encode(`d/user/${uid}/favs.json`),
    pred: uid => encode(`d/user/${uid}/pred.json`),
    hist: uid => encode(`d/user/${uid}/hist.json`),
    alarm: uid => encode(`d/user/${uid}/alarm.json`),
}

export const board = {
    ideas: encode('d/board/meta/idea.json'),
    idea: uid => encode(`d/board/idea/${uid}.json`)
}

export default { stock, user, board };