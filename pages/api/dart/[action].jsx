import Dart from '@/admin/module/dart';

export default function handler(req, res) {
    let { action } = req.query;
    let { code } = JSON.parse(req.body);
    switch (action) {
        case 'list':
            res.status(200).send(Dart.list())
            break;
        case 'earn':
            res.status(200).send(Dart.earn({ code }))
            break;
        default:
            res.status(400).send(false);
            break;
    }
}