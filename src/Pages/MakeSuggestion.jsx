import { useContext, useEffect } from "react"
import { UserData, supabase } from "../App"
import { Link } from "react-router-dom";

export default function MakeSuggestion() {

    const {user, setUser, notification, setNotification, openNotification, setOpenNotification} = useContext(UserData);

    useEffect(() => {
        document.title = 'PalettePro | Öneri yapın';
        window.scrollTo(0, 0);
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        
        const { data, error } = await supabase
            .from('suggestions')
            .insert([
                {
                    suggestion_text: formObj?.suggestion_text
                }
            ])
            .select()

            if(!error) {
                setOpenNotification(true);
                setNotification('Öneri gönderildi!')
            }
    }



    return (
        <div className="outlet-page">

            {
                user ?
                <div className="make-suggestion-page">

                    <form onSubmit={handleSubmit}>

                        <h3>Öneri Yapın</h3>

                        <textarea name="suggestion_text" rows={10} placeholder="Önerinizi yazın."></textarea>

                        <button>Öneriyi Gönder</button>

                    </form>

                </div>

                :

                <p className="warning">Yalnızca giriş yapmış kullanıcılar öneri yapabilir. Hemen <Link to={'/authentication'}>giriş yap</Link>ın.</p>
            }

        </div>
    )
}