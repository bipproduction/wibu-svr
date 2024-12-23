import { use } from "react";

export default function Page({ params }: { params: Promise<{ name: string }> }) {
    const {name} = use(params)
    return (
        <div>
            <h1>{name}</h1>
        </div>
    );
}