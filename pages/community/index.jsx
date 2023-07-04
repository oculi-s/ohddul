const Index = () => {
    return (
        <>준비중입니다.</>
    )
    return (
        <>
            <div>
                <h2>핫게</h2>
            </div>
            <div>
                <h2>인기종목</h2>
            </div>
        </>
    )
}

import container, { getServerSideProps } from "@/container/heavy";
export { getServerSideProps };
export default container(Index);