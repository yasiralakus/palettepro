import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { createClient } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from "react";

export const supabase = createClient('https://maqxohpksrxtwrnkncom.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcXhvaHBrc3J4dHdybmtuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNTMxMDMsImV4cCI6MjAzMDgyOTEwM30.QvGE_R0UNSV8fEYquQ1_BtOBw3t9VnL3U9geOtMxU_c')

export const UserData = createContext(null);

export default function App() {

    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState(null);
    const [openNotification, setOpenNotification] = useState(false);
    const [allUsers, setAllUsers] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState(null)
    const location = useLocation();
    const [openMobileMenu, setOpenMobileMenu] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setOpenNotification(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [openNotification]);

    useEffect(() => {
        setOpenMobileMenu(false);
    }, [location.pathname])

    useEffect(() => {
        async function fetchUser() {
            
            const { data: { user } } = await supabase.auth.getUser();
                
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user?.id)

            setUser(profiles ? profiles[0] : null)

            let { data: profilesAll } = await supabase
                .from('profiles')
                .select('*')

            setAllUsers(profilesAll ? profilesAll : null);
        }
        fetchUser();
    }, [])

    async function handleLogout(e) {
        e.preventDefault();
        
        let { error } = await supabase.auth.signOut();

        setUser(null)

    }

    useEffect(() => {
        setFilteredUsers(null)
    }, [location.pathname])


    async function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        if(formObj.search_text !== '') {
            const filteredUsers = allUsers?.filter(user => user.username.includes(formObj.search_text));
            setFilteredUsers(filteredUsers);
        }
    }

    return (
        <div className="full-page">

            <div style={openNotification === true ? {top: '0px'} : {}} className="copy">
                {notification}
            </div>

            <button id="go-to-top" onClick={() => (window.scrollTo(0, 0))}><i className="fa-solid fa-up-long"></i></button>

            <header className="header">

                <div className="container">

                    <Link to={'/'}>PalettePro</Link>

                    <form onSubmit={handleSearch}>
                        <input type="text" name="search_text" placeholder="Kullanıcı Ara..." autoComplete="off"/>
                        <button><i className="fa-solid fa-magnifying-glass"></i></button>
                        {filteredUsers && 
                        <div>
                            <button onClick={() => (setFilteredUsers(null))}><i className="fa-solid fa-xmark"></i></button>
                            {filteredUsers.map(x => (
                                <Link to={`/profile/${x.username}`} className="filteredUser">

                                    <img src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${x.profile_pic}`} alt="" />

                                    <div>
                                        <h3>{x.name} {x.surname}</h3>
                                        <p>@{x.username}</p>
                                    </div>
                                
                                </Link>
                            ))}
                        </div>}
                    </form>

                    <div className="mobile-nav">
                    <button style={openMobileMenu === true ? {transform: 'rotate(90deg)'} : {}} onClick={() => (openMobileMenu === true ? setOpenMobileMenu(false) : setOpenMobileMenu(true))} >|||</button>
                    {user === null && <NavLink to={'/authentication'}><i className="fa-solid fa-key"></i></NavLink>}

                    </div>
                    

                    {user === null ?
                        <ul>
                            <li><NavLink to={'/authentication'}><i className="fa-solid fa-key"></i></NavLink></li>
                        </ul>
                        :
                        <ul>
                            <li><NavLink to={'/'}><i className="fa-solid fa-house"></i></NavLink></li>
                            <li><NavLink to={'/followings'}><i className="fa-solid fa-user-group"></i></NavLink></li>
                            <li><NavLink to={'/create-palette'}><i className="fa-solid fa-plus"></i></NavLink></li>
                            <li><NavLink to={'/bookmarks'}><i className="fa-solid fa-star"></i></NavLink></li>
                            <li><NavLink to={`/profile/${user?.username}`}><i className="fa-solid fa-user"></i></NavLink></li>
                            <li><button onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i></button></li>
                        </ul>
                    }

                </div>

            </header>

            <main className="main">

                <div className="container">

                    <div style={openMobileMenu === true ? {left: '16px'} : {}} className="main-left">

                        {openMobileMenu === true &&
                        <>
                            <NavLink to={'/'}>Anasayfa</NavLink>
                            <NavLink to={'/followings'}>Takip Edilenler</NavLink>
                            <NavLink to={'/create-palette'}>Palet Oluştur</NavLink>
                            <NavLink to={'/bookmarks'}>Yıldızlananlar</NavLink>
                            <NavLink to={`/profile/${user?.username}`}>Profil</NavLink>
                            <button onClick={handleLogout}>Çıkış Yap</button>
                        </>
                        }

                        <NavLink to={'/settings'}>Ayarlar</NavLink>
                        <NavLink to={'/about'}>Hakkımızda</NavLink>
                        <NavLink to={'/next-updates'}>Sıradaki Güncellemeler</NavLink>
                        <NavLink to={'/statistics'}>İstatistikler</NavLink>
                        <NavLink to={'/make-a-suggestion'}>Öneri Yapın</NavLink>
                        <NavLink to={'/other-projects'}>Diğer Projeler</NavLink>
                        <NavLink to={'/d'}>Sıkça Sorulan Sorular</NavLink>

                    </div>

                    <div className="main-right">

                        <UserData.Provider value={{user, setUser, notification, setNotification, openNotification, setOpenNotification, setFilteredUsers}}>
                            <Outlet />
                        </UserData.Provider>

                    </div>


                </div>

            </main>

        </div>
    )
}