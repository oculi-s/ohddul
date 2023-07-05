import { Big } from "../ba";

export async function filterIndex(Index, code) {
    const b = Big(code);
    const index = {};
    for await (let e of Object.keys(Index)) {
        if (e == b) index[e] = Index[e];
        if (e.slice(0, -1) == b) index[e] = Index[e];
        if (e == b.slice(0, -1)) index[e] = Index[e];
    };
    return index;
}