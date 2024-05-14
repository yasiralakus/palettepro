import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function OtherProjects() {

    useEffect(() => {
        document.title = 'PalettePro | Diğer Projeler';
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="outlet-page">

            <div className="other-projects-page">

                <Link to={'https://yasiralakus.com.tr/'}>
                    <h3>Yasir Alakus Portfolyo Sitesi</h3>
                    <p>Tüm projelerime ulaşabileceğiniz websitesi.</p>
                </Link>
                <Link to={'https://yasiralakus-ankablog.netlify.app/'}>
                    <h3>Anka Blog</h3>
                    <p>Çok kullanıcılı blog platformu.</p>
                </Link>
                <Link to={'https://yasiralakus-career.netlify.app/'}>
                    <h3>Kariyer Sitesi</h3>
                    <p>Şirketleri ve insanları bir araya getiren kariyer sitesi.</p>
                </Link>
                <Link to={'https://yasiralakus-rockpaperscissors.netlify.app/'}>
                    <h3>Taş Kağıt Makas</h3>
                    <p>Bilgisayara karşı oynayabileceğiniz Taş Kağıt Makas oyunu.</p>
                </Link>
                <Link to={'https://yasiralakus-ecommerce.netlify.app/'}>
                    <h3>E-ticaret Sitesi</h3>
                    <p>Ürünlerin yer aldığı e-ticaret site tasarımı.</p>
                </Link>
                <Link to={'https://yasiralakus-filmapp.netlify.app/'}>
                    <h3>Dijital Film Platformu</h3>
                    <p>Dizi ve filmlerin yer aldığı dijital film platformu tasarımı.</p>
                </Link>

            </div>

        </div>
    )
}