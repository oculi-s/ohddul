interface StockLightType {
    c: string;
    n: string;
    g: number;
    value: number;
}

interface TreeChildType {
    g: number;
    value: number;
    children: StockLightType[];
}

export interface TreeType {
    group: TreeChildType[];
    last: number;
}