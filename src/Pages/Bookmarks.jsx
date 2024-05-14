import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserData, supabase } from "../App";

export default function Bookmarks() {

    const [loading, setLoading] = useState(false);
    const [postData, setPostData] = useState(null)
    const [allUsers, setAllUsers] = useState(null);
    const {user, setUser} = useContext(UserData);

    useEffect(() => {
        document.title = 'PalettePro | Yıldızlananlar'

        async function fetchData() {
            setLoading(true);
                window.scrollTo(0, 0);
                const { data: { user } } = await supabase.auth.getUser();

                let { data: bookmarks, error } = await supabase
                    .from('bookmarks')
                    .select('*')
                    .eq('user_id', user?.id)
                
                let { data: posts } = await supabase
                    .from('posts')
                    .select('*')
                    .in('post_id', bookmarks && bookmarks.map(x => x.post_id))
                    .order('created_at', { ascending: false })
                    setPostData(posts);

                let { data: profiles, error: errorProfiles } = await supabase
                    .from('profiles')
                    .select('*')
                    .in('user_id', posts && posts.map(x => x.user_id))
                    setAllUsers(profiles)

            setLoading(false);
        }

        fetchData();
    }, [])


    return (
        <div className="outlet-page">

            <div className="palette-items">

                {   
                    loading === true ?
                    <div className="loading-bg">
                        <div className="loading"></div>
                    </div>
                    :
                    user ?
                    postData?.length > 0 ?
                    postData?.map(x => (
                        <Link to={`/post/${x.username}/${x.post_id}`} key={x.post_id} className="palette-item">

                            <div className="palette-item-user-details">

                                {allUsers && (
                                    <img
                                        src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${allUsers.find(y => y.user_id === x.user_id)?.profile_pic || null}`}
                                    />
                                )}

                                <div>
                                    <h3>{allUsers?.map(y => y.user_id === x.user_id ? `${y.name} ${y.surname}` : '')}</h3>
                                    <p><Link>@{allUsers?.map(y => y.user_id === x.user_id ? `${y.username}` : '')}</Link> - {Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000) < 1 ? `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 60000)} dakika önce` : `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000)} saat önce`}</p>
                                </div>

                            </div>

                            <p>{x.post_title}</p>

                            <div className="palette-item-colors">

                                {x.color_1 !== null && <div style={{backgroundColor: x.color_1}}></div>}
                                {x.color_2 !== null && <div style={{backgroundColor: x.color_2}}></div>}
                                {x.color_3 !== null && <div style={{backgroundColor: x.color_3}}></div>}
                                {x.color_4 !== null && <div style={{backgroundColor: x.color_4}}></div>}
                                {x.color_5 !== null && <div style={{backgroundColor: x.color_5}}></div>}
                                {x.color_6 !== null && <div style={{backgroundColor: x.color_6}}></div>}

                            </div>

                        </Link>
                    ))
                    : <p className="warning">Yıldızlananlar listenizde paylaşım bulunamadı.</p>
                    :
                    <p className="warning">Paylaşımları kaydetmek ve daha sonra görüntülemek için <Link>giriş yap</Link>malısınız.</p>
                }

            </div>

        </div>
    )
}