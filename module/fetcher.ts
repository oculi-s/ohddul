export default function Fetcher(type: 'read' | 'write', body?: any) {
    body.apiKey = process.env.NEXT_PUBLIC_OHDDUL_KEY
    return fetch(`https://api.ohddul.com/${type}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }).then(res => res.json())
}

export function FetcherRead(url: string) {
    return Fetcher('read', { url })
}