import HEAD from "#/common/Head";
import Aside from "#/common/aside";
import Footer from "#/common/footer";
import Nav from "#/common/nav";
import { useEffect, useState } from "react";

export default function Container(Component) {
    return function Index(props) {
        const [mobAside, setAsideShow] = useState(false);
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