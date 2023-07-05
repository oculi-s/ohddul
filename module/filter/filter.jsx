import { Big } from "../ba";

export async function filterIndex(Index, code) {
    const b = Big(code);
    const index = { data: {} };
    for await (let e of Object.keys(Index)) {
        if (e == b) index.data[e] = Index[e];
        if (e.slice(0, -1) == b) index.data[e] = Index[e];
        if (e == b.slice(0, -1)) index.data[e] = Index[e];
    };
    return index;
}