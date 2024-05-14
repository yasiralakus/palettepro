import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { UserData, supabase } from "../App";

export async function loader( {params} ) {


    return params;
}

export default function EditProfile() {

    const params = useLoaderData();
    const {user, setUser, notification, setNotification, openNotification, setOpenNotification} = useContext(UserData);
    const navigate = useNavigate();
    const [editUserData, setEditUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        document.title = `PalettePro - Profil Düzenleme`;
        window.scrollTo(0, 0);

        async function fetchData() {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser();
            
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user?.id)

            setEditUserData(profiles ? profiles[0] : null)
            setLoading(false);
        }

        fetchData();
    }, [])

    async function handleEditProfile(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        if(formObj.profile_pic.size > 0) {
            const { data: dataProfilePic, error } = await supabase
                .storage
                .from('images')
                .upload(`${user?.user_id}/profile_pic/${user?.user_id}${Math.floor(Math.random() * 100000)}.jpg`, formObj?.profile_pic);

            const { data } = await supabase
                .from('profiles')
                .update([
                    {
                        profile_pic: dataProfilePic.fullPath
                    }
                ])
                .eq('user_id', user?.user_id)
                .select()
        }

        if(formObj.cover_pic.size > 0) {
            const { data: dataCoverPic, error } = await supabase
                .storage
                .from('images')
                .upload(`${user?.user_id}/cover_pic/${user?.user_id}${Math.floor(Math.random() * 100000)}.jpg`, formObj?.cover_pic);

            const { data } = await supabase
                .from('profiles')
                .update([
                    {
                        cover_pic: dataCoverPic.fullPath
                    }
                ])
                .eq('user_id', user?.user_id)
                .select()
        }

        const { data } = await supabase
            .from('profiles')
            .update([
                {
                    name: formObj.name,
                    surname: formObj.surname,
                    biography: formObj.biography,
                    instagram: formObj.instagram,
                    twitter: formObj.twitter,
                    facebook: formObj.facebook,
                    linkedin: formObj.linkedin,
                    github: formObj.github,
                }
            ])
            .eq('user_id', user?.user_id)
            .select()

            navigate(`/profile/${user?.username}`)
            
            setOpenNotification(true);
            setNotification('Düzenleme başarıyla kaydedildi.')
        

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
                    editUserData?.username === params.username ?
                    <div className="edit-profile-page">
                        <form onSubmit={handleEditProfile}>
                            <h1>Profil Düzenleme: {editUserData?.username}</h1>
                            <div>
                                <h3>İsim</h3>
                                <input type="text" name="name" defaultValue={editUserData?.name} />
                            </div>
                            <div>
                                <h3>Soyisim</h3>
                                <input type="text" name="surname" defaultValue={editUserData?.surname} />
                            </div>
                            <div>
                                <h3>Hakkında</h3>
                                <textarea name="biography" rows={4} defaultValue={editUserData?.biography}></textarea>
                            </div>
                            <div>
                                <h3>Profil Fotoğrafı</h3>
                                <input type="file" name="profile_pic"/>
                            </div>
                            <div>
                                <h3>Kapak Fotoğrafı</h3>
                                <input type="file" name="cover_pic"/>
                            </div>

                            <div>
                                <h3>Instagram</h3>
                                <input type="text" name="instagram" defaultValue={editUserData?.instagram} />
                            </div>

                            <div>
                                <h3>Facebook</h3>
                                <input type="text" name="facebook" defaultValue={editUserData?.facebook} />
                            </div>

                            <div>
                                <h3>Twitter</h3>
                                <input type="text" name="twitter" defaultValue={editUserData?.twitter} />
                            </div>

                            <div>
                                <h3>Linkedin</h3>
                                <input type="text" name="linkedin" defaultValue={editUserData?.linkedin} />
                            </div>

                            <div>
                                <h3>Github</h3>
                                <input type="text" name="github" defaultValue={editUserData?.github} />
                            </div>

                            <button>Düzenlemeleri Kaydet</button>
                            
                        </form>
                    </div>
                    :
                    <p className="warning">Bu işlem için izniniz yok! Yalnızca <u>kendi profilinizi</u> düzenleyebilirsiniz.</p>
                    :
                    <p className="warning">Profil düzenleme işlemi için <Link to={'/authentication'}>giriş yap</Link>malısınız.</p>
                }

           

        </div>
    )
}