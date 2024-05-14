import { useContext, useEffect, useState } from "react"
import { UserData, supabase } from "../App"
import { Link } from "react-router-dom";

export default function Followings() {

    const {user, setUser} = useContext(UserData);
    const [followsPostData , setFollowPostData] = useState(null);
    const [allUsers, setAllUsers] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        document.title = 'PalettePro | Takip edilenler'

        async function fetchData() {

            setLoading(true)
            window.scrollTo(0, 0);
            const { data: { user } } = await supabase.auth.getUser();

            let { data: follows, error } = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id', user?.id)
            
            let { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                setAllUsers(profiles ? profiles : null);
            
            let { data: posts } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })
                .in('user_id', follows && follows.map(x => x.takipedilen_id))
                setFollowPostData(posts ? posts : null);

            setLoading(false);
          
        }

        fetchData();
    }, [])



    return (
        <div className="outlet-page">

            <div className="followings-page">

                {
                    user ?

                    loading === true ?
                    <div className="loading-bg">
                        <div className="loading"></div>
                    </div>

                    :

                    <div className="palette-items">

                        {followsPostData?.length > 0 ? 
                            followsPostData.map(x => (
                            <Link to={`/post/${x.username}/${x.post_id}`} key={x.post_id} className="palette-item">

                            <div className="palette-item-user-details">

                            {allUsers && (
                                <img
                                    src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${allUsers.find(y => y.user_id === x.user_id)?.profile_pic || null}`}
                                />
                            )}

                                <div>
                                    <h3>{allUsers?.map(y => y.user_id === x.user_id ? `${y.name} ${y.surname}` : '')}</h3>
                                    <p><span>@{allUsers?.map(y => y.user_id === x.user_id ? `${y.username}` : '')}</span> - {Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000) < 1 ? `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 60000)} dakika önce` : `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000)} saat önce`}</p>
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
                        )) : loading === false && <p className="warning">Takip ettiğiniz kullanıcıların paylaşımları burada görünecek.</p>

                        }

                    </div>

                    :

                    loading === false && <p className="warning">Takip ettiğiniz kullanıcıların paylaşımlarını görmek için <Link to={'/authentication'}>giriş yap</Link>malısınız.</p>
                }

            </div>

        </div>
    )
}