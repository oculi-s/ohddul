import encode from '@/module/alias';

export const stock = {
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
    pred: code => encode(`&/${code}/predict.json`),
    dart: {
        induty: encode('_/induty.json'),
        xml: encode('_/CORPCODE.xml'),
        list: encode('_/dart.json'),
    }
}

export const user = {
    meta: encode(`$/user/meta.json`),
    fav: uid => encode(`$/user/${uid}/favorites.json`),
    pred: uid => encode(`$/user/${uid}/predict.json`),
}

export default { stock, user };