import { useState } from "react";

export function getServerSideProps(ctx) {
    const props = {};
    return { props };
}

export default function Editor() {
    const [type, setType] = useState(0);

    if (type == 0) {

    }
}