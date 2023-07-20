export async function filterIndex(Index, c) {
    const index = {};
    for await (let e of Object.keys(Index)) {
        if (e == '_') index[e] = Index[e];
        if (e == c) index[e] = Index[e];
        if (e.slice(0, -1) == c) index[e] = Index[e];
        if (e == c.slice(0, -1)) index[e] = Index[e];
        if (c.length == 1 && c == e.slice(0, -2)) index[e] = Index[e];
        if (c.length == 3 && e == c.slice(0, -2)) index[e] = Index[e];
    };
    return index;
}