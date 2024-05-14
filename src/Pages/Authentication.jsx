import { useContext, useEffect, useState } from "react"
import { UserData, supabase } from "../App";
import { useNavigate } from "react-router-dom";

export default function Authentication() {

    const [isPageLogin, setIsPageLogin] = useState(true);
    const {user, setUser, notification, setNotification, openNotification, setOpenNotification} = useContext(UserData);
    const [allUsers, setAllUsers] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'PalettePro | Giriş İşlemleri';

        async function fetchData() {
            
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('username')

                setAllUsers(profiles ? profiles : null);

        }

        fetchData();

    }, [])

    async function handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        
        let { data: loginData, error } = await supabase.auth.signInWithPassword(formObj);

        if(!error) {
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', loginData.user.id)
                setUser(profiles ? profiles[0] : null)
                navigate('/');
                setOpenNotification(true);
                setNotification(`Giriş başarılı. Hoşgeldin ${profiles[0]?.name} ${profiles[0]?.surname}!`);
        }

  
    }

    async function handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        for( let i = 0; i < allUsers?.length; i++ ){
            if(formObj.username === allUsers[i].username) {
                setOpenNotification(true);
                setNotification('Kullanıcı adı kullanımda!')
                return;
            }
        }

        if(formObj.username.includes('ş') || formObj.username.includes('ç') || formObj.username.includes('ü') || formObj.username.includes('ö') || formObj.username.includes('ı') || formObj.username.includes('ğ')) {
            setOpenNotification(true);
            setNotification('Kullanıcı adında türkçe karakter kullanılamaz!')
            return;
        }

        if(formObj.username.includes('.') || formObj.username.includes(',') || formObj.username.includes('-') || formObj.username.includes('_') || formObj.username.includes(':') || formObj.username.includes('?') || formObj.username.includes('!') || formObj.username.includes('$') || formObj.username.includes('"') || formObj.username.includes('=')) {
            setOpenNotification(true);
            setNotification('Kullanıcı adında özel karakter kullanılamaz!')
            return;
        }

        if(formObj.username.includes(' ')) {
            setOpenNotification(true);
            setNotification('Kullanıcı adında boşluk kullanılamaz!')
            return;
        }

        for (var i = 0; i < formObj.username.length; i++) {
            if (formObj.username[i] !== formObj.username[i].toLowerCase()) {
                setOpenNotification(true);
                setNotification('Kullanıcı adı sadece küçük harf içermelidir!');
                return;
            }
        }

        if(formObj.username.length < 6) {
            setOpenNotification(true);
            setNotification('Kullanıcı adı 6 karakterden kısa olamaz!')
            return;
        }

        if(formObj.password.length < 6) {
            setOpenNotification(true);
            setNotification('Şifre 6 karakterden kısa olamaz!')
            return;
        }

        let { data: signupData, error } = await supabase.auth.signUp(formObj);

        if(error && error.status === 422) {
            setOpenNotification(true);
            setNotification('Eposta zaten kayıtlı!')
        }

        if(!error) {
            
            const { data, error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        username: formObj.username,
                        name: formObj.name,
                        surname: formObj.surname,
                        email: signupData.user.email,
                        profile_pic: 'images/no-image/user.jpg',
                        cover_pic: 'images/no-cover-pic/12066098_4873152.jpg'
                    }
                ])
                .select()
            
            if(!profileError) {
                setUser(data ? data[0] : null);
                setOpenNotification(true);
                setNotification(`Kayıt başarılı. Hoşgeldin ${data[0]?.name} ${data[0]?.surname}!`)
                navigate('/');
            }

        }
  
    }

    return (
        <div className="outlet-page">

            <div className="authentication-page">

                <header>
                    <button onClick={() => (setIsPageLogin(true))} style={isPageLogin === true ? {backgroundColor: '#D2E3FF', color: '#0055FF'} : {}}>Giriş Yap</button>
                    <button onClick={() => (setIsPageLogin(false))} style={isPageLogin === false ? {backgroundColor: '#D2E3FF', color: '#0055FF'} : {}}>Kayıt Ol</button>
                </header>

                <main>

                    {isPageLogin === true ?
                        <form onSubmit={handleLogin}>
                            <input type="text" name="email" placeholder="E-posta" required/>
                            <input type="password" name="password" placeholder="Şifre" required/>
                            <button>Giriş Yap</button>
                        </form>
                    :
                        <form onSubmit={handleSignup}>
                            <div>
                                <input type="text" name="name" placeholder="İsim" required />
                                <input type="text" name="surname" placeholder="Soyisim" required />
                            </div>
                            <input type="text" name="username" placeholder="Kullanıcı Adı" required />
                            <input type="text" name="email" placeholder="E-posta" required/>
                            <input type="password" name="password" placeholder="Şifre" required/>
                            <button>Kayıt Ol</button>
                        </form>
                    }
                </main>

            </div>

        </div>
    )
}