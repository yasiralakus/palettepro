import { useEffect } from "react";

export default function Settings() {

    useEffect(() => {
        document.title = 'PalettePro | Ayarlar';
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="outlet-page">

            <div className="settings-page">

                <p className="warning">Yakında...</p>

            </div>

        </div>
    )
}