import { updateAll } from '@/admin/module/update';
import json from '@/module/json';
import dir from '@/module/dir';

export default async function handler(req, res) {
    let { action } = req.query;
    let { code } = JSON.parse(req.body);
    const meta = json.read(dir.stock.meta).data;
    const user = json.read(dir.user.meta);
    switch (action) {
        case 'all':
            await updateAll();
            res.status(200).send();
            break;
        case 'stop':
            json.write('$/.update', { updating: 0 });
            res.status(200).send();
            break;
        case 'earn':
            for await (let code of Object.keys(meta)) {
                json.remove(dir.stock.earn(code));
            }
            res.status(200).send();
            break;
        case 'price':
            for await (let code of Object.keys(meta)) {
                json.remove(dir.stock.price(code));
            }
            res.status(200).send();
            break;
        case 'share':
            for await (let code of Object.keys(meta)) {
                json.remove(dir.stock.share(code));
            }
            res.status(200).send();
            break;
        case 'pred':
            json.remove(dir.stock.predAll);
            for await (let code of Object.keys(meta)) {
                json.remove(dir.stock.pred(code));
            }
            for await (let uid of Object.keys(user)) {
                json.remove(dir.user.pred(uid));
            }
            res.status(200).send();
            break;
        default:
            res.status(400).send(false);
            break;
    }
}