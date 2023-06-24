import crawl from '@/module/stock/crawl';

export default function handler(req, res) {
    let { action } = req.query;
    let { code } = JSON.parse(req.body);
    switch (action) {
        case 'meta':
            res.status(200).send(crawl.meta())
            break;
        case 'group':
            res.status(200).send(crawl.group())
            break;
        case 'price':
            res.status(200).send(crawl.price({ code }))
            break;
        default:
            res.status(400).send(false);
            break;
    }
}