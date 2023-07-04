/**
 * 주식분할을 감지하는 함수
 * 
 * 우선 시간 오름차순으로 정렬 후 전일 대비 상하한가 이상의 변화가 있을 때 뒷부분의 데이터를 비율만큼 나눈 값으로 업데이트
 * 2023.07.04 30%로 딱 떨어지게 만들면 안됨. 50% 정도로 타협
 */
export const priceDivide = async (price) => {
    const len = price?.data?.length;
    if (!len) return;
    for await (let i of Array(len).keys()) {
        if (i == 0) continue;
        if (!price.data[i]?.c) continue;
        if (!price.data[i - 1]?.c) continue;
        const p = price.data[i]?.c / price.data[i - 1]?.c;
        if (i > 0 && (p < 0.5 || 1.5 < p)) {
            const newPrice = price?.data?.slice(i)
                .map(e => {
                    return { ...e, c: e?.c / p };
                });
            price?.data?.splice(i, newPrice.length, ...newPrice);
        }
    }
}
