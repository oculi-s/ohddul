

export type CodeType = string;

export interface StockMetaLightType {
    n: string;
    t: "Q" | "K";
    a: number;
}

export interface StockEarnFixedType {
    no: string;
    equity: number;
    revenue: number;
    profit: number;
    data: boolean;
    date: string;
    sum: {
        revenue: number;
        profit: number;
    }
}

export interface StockShareFixedType {
    no: string;
    date: string;
    amount: number;
    rate: number;
    name: string;
}

export interface StockShareOtherType {
    no: string;
    date: string;
    from: CodeType;
    amount: number;
}

export interface StockPriceDailyType {
    d: string;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    bps: number;
    eps: number;
}

export interface StockTodayType {
    c: number;
    p: number;
    bps: number;
    eps: number;
}

export interface PriceCloseDailyType {
    d: string;
    c: number;
    o?: number;
    h?: number;
    l?: number;
    v?: number;
    bps?: number;
    eps?: number;
}
