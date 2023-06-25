import json from '@/module/json';

export default function handler(req, res) {
    let { action } = req.query;
    let { url, data } = JSON.parse(req.body);
    switch (action) {
        case 'read':
            res.status(200).send(json.read(url))
            break;
        case 'write':
            res.status(200).send(json.write(url, data, false));
            break;
        case 'queue':
            res.status(200).send(json.queue(url, data, false));
            break;
        case 'toggle':
            res.status(200).send(json.toggle(url, data));
            break;
        case 'up':
            res.status(200).send(json.up(url, data));
            break;
        default:
            res.status(400).send(false);
            break;
    }
}