import { CodeType } from ".";

interface StockLeafType {
    c: CodeType,
    n: string,
    g: number,
    value: number,
}

interface GroupLeafType {
    g: number;
    value: number;
    children: StockLeafType[];
}

interface IndutyLeafType {
    g: number;
    c: string;
    value: number;
    children: StockLeafType[];
}

export interface TotalTreeType {
    group: GroupLeafType[];
    induty: IndutyLeafType[];
    last: number;
    index: {
        group: string[];
        induty: string[];
    }
}