function Index({ }) {
    return (
        <>
            준비중입니다.
        </>
    )
}

import container, { getServerSideProps } from "@/pages/container";
const getStaticProps = getServerSideProps;
export { getStaticProps };
export default container(Index);