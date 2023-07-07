import encode from '@/module/alias';

export const stock = {
    update: encode('_/.update'),
    code: encode('_/code.json'),
    crno: encode('_/crno.json'),
    name: encode('_/name.json'),
    meta: encode('_/meta.json'),
    date: encode('_/date.json'),
    group: encode('_/group.json'),
    all: encode('_/price.json'),
    market: encode('_/market.json'),
    induty: encode('_/index.json'),
    predAll: encode('_/predict.json'),
    price: code => encode(`&/${code}/price.json`),
    earn: code => encode(`&/${code}/earn.json`),
    share: code => encode(`&/${code}/share.json`),
    pred: code => encode(`#/${code}.json`),
    light: {
        aside: encode('_/light/aside.json'),
        market: encode('_/light/market.json'),
        price: code => encode(`&/${code}/priceClose.json`),
        earn: code => encode(`&/${code}/earnFixed.json`),
        count: encode('_/light/count.json'),
        tree: encode('_/light/tree.json'),
        updown: encode('_/light/updown.json'),
    },
    dart: {
        induty: encode('_/induty.json'),
        xml: encode('_/CORPCODE.xml'),
        list: encode('_/dart.json'),
    }
}

export const user = {
    admin: encode('@/module/auth/user.json'),
    meta: uid => encode(`@/data/user/${uid}/meta.json`),
    alarm: uid => encode(`@/data/user/${uid}/alarm.json`),
    favs: uid => encode(`@/data/user/${uid}/favs.json`),
    pred: uid => encode(`@/data/user/${uid}/pred.json`),
}

export default { stock, user };