import { useEffect } from "react";

export default function toggleOnPageChange(router, myToggle, value = false) {
    useEffect(() => {
        const handle = () => {
            if (myToggle) myToggle(value);
        };
        router.events.on("routeChangeComplete", handle);
        router.events.on("routeChangeError", handle);
        return () => {
            router.events.off("routeChangeComplete", handle);
            router.events.off("routeChangeError", handle);
        };
    }, [router.query]);
}