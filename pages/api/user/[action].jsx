import { findId, change, meta } from '@/module/auth/user';

export default async function handler(req, res) {
    let { action } = req.query;
    let { id, uid, email } = JSON.parse(req.body);
    switch (action) {
        case 'find':
            res.status(200).send(findId(id));
            break;
        case 'change':
            res.status(200).send(change({ id, uid, email }));
            break;
        case 'meta':
            res.status(200).send(meta())
            break;
        default:
            res.status(400).send(false);
            break;
    }
}