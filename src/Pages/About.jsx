import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {

    useEffect(() => {
        document.title = 'PalettePro | Hakkımızda';
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="outlet-page">
        
            <div className="about-page">

                <h3>PalettePro nedir?</h3>

                <p>PalettePro genç bir girişimci tarafından ortaya çıkartılan, renklere ve renkler arasındaki uyuma ilgi duyan kişilerin bir arada olmasını sağlayacak bir sosyal medya platformudur.</p>

                <h3>PalettePro kimler için hayata geçirildi?</h3>

                <p>PalettePro renklere ve renkler arasındaki uyuma ilgi duyan, renklerle çalışmayı profesyonel iş veya hobi haline getiren kişiler için topluluk oluşturma amacıyla hayata geçirildi.</p>

                <h3>PalettePro nasıl kullanılır?</h3>

                <p>PalettePro'ya herkes eposta adresi ile kayıt olabilir. Kayıt olduktan sonra istediğiniz renkleri kullanarak bir renk paleti oluşturabilir ve güzel bir başlıkla bu renk paletini diğer kullanıcılarımıza sunabilirsiniz. Kullanıcılarımızın oluşturduğu renk paletleri diğer kullanıcılar için ilham kaynağı olabilir. Diğer kullanıcıları takip edebilir ve paylaşımlarını beğenip, yorumlayıp, kaydedebilirsiniz. Aynı zamanda <Link to={'/make-a-suggestion'}>öneri yapın</Link> sayfası aracılığıyla önerilerinizi bizlere iletebilirsiniz. </p>

                <h3>Ekibimiz</h3>

                <p>Muhammed Yasir ALAKUŞ - Kurucu</p>

            </div>

        </div>
    )
}