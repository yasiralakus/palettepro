import { useEffect, useState } from "react"
import { supabase } from "../App";

export default function Statistics() {

    const [loading, setLoading] = useState(true);
    const [postCount, setPostCount] = useState(null);
    const [userCount, setUserCount] = useState(null);

    useEffect(() => {

        window.scrollTo(0, 0);
        document.title = 'PalettePro | İstatistikler';

        async function fetchData() {

            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
            setPostCount(posts ? posts.length : null)

            let { data: profiles } = await supabase
                .from('profiles')
                .select('*')
            setUserCount(profiles ? profiles.length : null)

            setLoading(false);
        }

        fetchData();

    }, [])



    return (
        <div className="outlet-page">

            {
                loading === true ?
                <div className="loading-bg">
                    <div className="loading"></div>
                </div>
                :
                <div className="statistics-page">

                    <h1>İstatistikler</h1>

                    <div>
                        <h3>Yayına giriş tarihi</h3>
                        <h2>12.06.2024</h2>
                    </div>

                    <div>
                        <h3>Paylaşım sayısı</h3>
                        <h2>{postCount}</h2>
                    </div>
                    
                    <div>
                        <h3>Kullanıcı sayısı</h3>
                        <h2>{userCount}</h2>
                    </div>

                </div>
            }

        </div>
    )
}