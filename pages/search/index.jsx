import { useRouter } from 'next/router'
import Link from 'next/link'

export function getServerSideProps(ctx) {
    const aside = json.read(dir.stock.light.aside);
    const props = { aside };
    return { props };
}

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

import container from "@/container/light";
export default container(Index);