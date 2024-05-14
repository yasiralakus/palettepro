import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../App";

export default function Home() {

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        document.title = 'PalettePro | Anasayfa',
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            
            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });
                setPosts(posts);

            
            let { data: profiles, error: errorProfiles } = await supabase
                .from('profiles')
                .select('*')
                .in('user_id', posts && posts.map(x => x.user_id))
                setUsers(profiles);

            setLoading(false);

        }
        fetchData();
    }, [])


    return (
        <div className="outlet-page">

            {loading === true ?
            <div className="loading-bg">
                <div className="loading"></div>
            </div>
            :    

            <div className="palette-items">

                {posts ? 
                    posts.map(x => (
                    <Link to={`/post/${x.username}/${x.post_id}`} key={x.post_id} className="palette-item">

                    <div className="palette-item-user-details">

                        {users && (
                            <img
                                src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${users.find(y => y.user_id === x.user_id)?.profile_pic || null}`}
                            />
                        )}

                        <div>
                            <h3>{users?.map(y => y.user_id === x.user_id ? `${y.name} ${y.surname}` : '')}</h3>
                            <p><span>@{users?.map(y => y.user_id === x.user_id ? `${y.username}` : '')}</span> - {Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000) < 1 ? `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 60000)} dakika önce` : `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000)} saat önce`}</p>
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
                )) : ''
                }

            </div>
            }
        </div>
    )
}