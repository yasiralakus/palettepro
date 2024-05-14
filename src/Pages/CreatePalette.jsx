import { useContext, useEffect, useState } from "react"
import { UserData, supabase } from "../App";
import { Link, useNavigate } from "react-router-dom";

export default function CreatePalette() {

    const [numberOfColors, setNumberOfColors] = useState(1);
    const {user, setUser, notification, setNotification, openNotification, setOpenNotification} = useContext(UserData);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [color1, setColor1] = useState('#000')
    const [color2, setColor2] = useState('#000')
    const [color3, setColor3] = useState('#000')
    const [color4, setColor4] = useState('#000')
    const [color5, setColor5] = useState('#000')
    const [color6, setColor6] = useState('#000')

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 600);

        return () => clearTimeout(timeout);
    }, []);


    useEffect(() => {
        document.title = 'PalettePro | Palet Oluştur';
        window.scrollTo(0, 0);
    }, [])

    function handleNumberOfColors(e) {
        setNumberOfColors(Number(e.target.value))
    }

    function handleColor1(e) {
        setColor1(e.target.value)
    }

    function handleColor2(e) {
        setColor2(e.target.value)
    }

    function handleColor3(e) {
        setColor3(e.target.value)
    }

    function handleColor4(e) {
        setColor4(e.target.value)
    }

    function handleColor5(e) {
        setColor5(e.target.value)
    }

    function handleColor6(e) {
        setColor6(e.target.value)
    }

    async function createPalette(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    user_id: user.user_id,
                    post_title: formObj.post_title,
                    color_1: formObj.color_1,
                    color_2: formObj.color_2,
                    color_3: formObj.color_3,
                    color_4: formObj.color_4,
                    color_5: formObj.color_5,
                    color_6: formObj.color_6,
                    username: user.username
                }
            ])
            .select()

            if(!error) {
                navigate('/');
                setNotification('Renk paleti başarıyla paylaşıldı!')
                setOpenNotification(true)
            }

    }

    return (
        <div className="outlet-page">

            {
                loading === true ?
                <div className="loading-bg">
                    <div className="loading"></div>
                </div>
                :

                user ?
            

                <div className="create-page">

                    <form onSubmit={createPalette}>

                        <h1>Renk Paleti Oluştur</h1>

                        <select name="" id="" onChange={handleNumberOfColors}>
                            <option value="" selected disabled>Kaç renk kullanmak istersin?</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>

                        <div className="">
                            <input onChange={handleColor1} type="color" name="color_1" />
                            {numberOfColors > 1 && <input onChange={handleColor2} type="color" name="color_2" />}
                            {numberOfColors > 2 && <input onChange={handleColor3} type="color" name="color_3" />}
                            {numberOfColors > 3 && <input onChange={handleColor4} type="color" name="color_4" />}
                            {numberOfColors > 4 && <input onChange={handleColor5} type="color" name="color_5" />}
                            {numberOfColors > 5 && <input onChange={handleColor6} type="color" name="color_6" />}
                        </div>

                        <h3>Önizleme</h3>

                        <div className="preview">
                            <div style={{backgroundColor: color1}}></div>
                            {numberOfColors > 1 && <div style={{backgroundColor: color2}}></div>}
                            {numberOfColors > 2 && <div style={{backgroundColor: color3}}></div>}
                            {numberOfColors > 3 && <div style={{backgroundColor: color4}}></div>}
                            {numberOfColors > 4 && <div style={{backgroundColor: color5}}></div>}
                            {numberOfColors > 5 && <div style={{backgroundColor: color6}}></div>}
                        </div>

                        <h3>Metin Ekle</h3>

                        <textarea name="post_title" rows={5}></textarea>
                        <button>Paylaş</button>

                    </form>

                </div>

                :

                <p className="warning">Paylaşım yapmak için <Link to={'/authentication'}>giriş yap</Link>malısınız.</p>
            }
        </div>
    )
}