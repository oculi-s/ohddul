import { PriceCloseDailyType } from "./stock";

export interface MarketType {
    kospi: PriceCloseDailyType[];
    kosdaq: PriceCloseDailyType[];
    last: number;
}

export interface CountType {
    up: { kospi: number, kosdaq: number };
    down: { kospi: number, kosdaq: number };
    all: { kospi: number, kosdaq: number };
    last: number;
}

export interface EcosType {
    data: { [country: string]: { v: number, d: string }[] };
    check: { [year: string]: boolean };
    last: number;
}