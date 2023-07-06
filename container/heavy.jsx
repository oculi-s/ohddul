import { useEffect, useState } from "react";

export default function Container(Component) {
    return function Index(props) {
        const [User, setUser] = useState();
        useEffect(() => {
            if (!User) setUser(props?.user);
        }, [])
        props = {
            User, setUser,
            ...props,
        };
        return <Component {...props} />
    };
}