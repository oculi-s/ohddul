import { CodeType, StockEarnFixedType, StockMetaLightType, StockPriceDailyType, StockShareFixedType, StockShareOtherType, StockTodayType } from "./stock";

export interface UserMetaType {
    name: string;
    email: string;
    rank: number;
    last: number;
    signed: number;
    id: string;
}

export interface MetaType {
    data: { [code: CodeType]: StockMetaLightType },
    index: { [name: string]: CodeType }
}

export interface EarnFixedType {
    data: StockEarnFixedType[];
    last: number;
}

export interface ShareFixedType {
    data: StockShareFixedType[];
    last: number;
}

export interface ShareOtherType {
    data: StockShareOtherType[];
    last: number;
}

export interface StockPriceType {
    data: StockPriceDailyType[];
    last: number;
}

export interface CloseType {
    [code: CodeType]: StockTodayType;
}