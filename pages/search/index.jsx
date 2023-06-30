import { useRouter } from 'next/router'
import Link from 'next/link'

const Header = ({ router }) => (
    <h1>검색어 : {router.query?.q}</h1>
)

const Index = () => {
    const router = useRouter();
    const props = { router }
    return (
        <>
            <Header {...props} />
        </>
    )
}

import container, { getServerSideProps } from "@/container";
export { getServerSideProps };
export default container(Index);