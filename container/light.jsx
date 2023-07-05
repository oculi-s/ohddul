import { Loading } from "#/_base";
import HEAD from "#/common/Head";
import Aside from "#/common/aside";
import Footer from "#/common/footer";
import Nav from "#/common/nav";
import { useEffect, useState } from "react";

export default function Container(Component) {
    return function Index(props) {
        const [mobAside, setAsideShow] = useState(false);
        const [User, setUser] = useState();
        useEffect(() => {
            setUser(props?.user);
        }, [])
        if (props?.status == 'loading') return Loading();
        props = {
            User, setUser,
            mobAside, setAsideShow,
            ...props,
        };
        return (
            <>
                <HEAD {...props} />
                <Nav {...props} />
                <Aside {...props} />
                <main>
                    <Component {...props} />
                </main>
                <Footer />
            </>
        );
    };
}