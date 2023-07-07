import { findId, change } from '@/module/auth/user';

export default async function handler(req, res) {
    let { action } = req.query;
    let { id, uid, email } = JSON.parse(req.body);
    switch (action) {
        case 'find':
            res.status(200).send(await findId(id));
            break;
        case 'change':
            res.status(200).send(await change({ id, uid, email }));
            break;
        default:
            res.status(400).send(false);
            break;
    }
}