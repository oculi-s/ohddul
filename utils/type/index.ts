export interface UserMetaType {
    name: string;
    email: string;
    rank: number;
    last: number;
    signed: number;
    id: string;
}

export type CodeType = string;

export interface StockMetaLightType {
    n: string;
    t: "Q" | "K";
    a: number;
}

export interface MetaType {
    data: { [code: CodeType]: StockMetaLightType },
    index: { [name: string]: CodeType }
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

export interface EarnFixedType {
    data: StockEarnFixedType[];
    last: number;
}

export interface StockShareFixedType {
    no: string;
    date: string;
    amount: number;
    rate: number;
    name: string;
}

export interface ShareFixedType {
    data: StockShareFixedType[];
    last: number;
}

export interface StockShareOtherType {
    no: string;
    date: string;
    from: CodeType;
    amount: number;
}

export interface ShareOtherType {
    data: StockShareOtherType[];
    last: number;
}

interface StockPriceDailyType {
    d: string;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    bps: number;
    eps: number;
}

export interface StockPriceType {
    data: StockPriceDailyType[];
    last: number;
}

export interface StockCloseType {
    c: number;
    p: number;
    bps: number;
    eps: number;
}

export interface CloseType {
    [code: CodeType]: StockCloseType;
}