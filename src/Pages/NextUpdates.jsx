import { useEffect } from "react";

export default function NextUpdates() {

    useEffect(() => {
        document.title = 'PalettePro | Sıradaki Güncellemeler';
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="outlet-page">

            <div className="next-updates-page">

                <p className="warning">Yakında...</p>

            </div>

        </div>
    )
}