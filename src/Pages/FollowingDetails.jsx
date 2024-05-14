import { useEffect, useState } from "react";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import { supabase } from "../App";

export async function loader( {params} ) {

    console.log(params)

    return params;
}

export default function FollowingDetails() {

    const params = useLoaderData();
    const [followingData, setFollowingData] = useState(null);
    const [followerData, setFollowerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState(null);
    const location = useLocation();
    const [error, setError] = useState(false);

    useEffect(() => {
        document.title = `PalettePro | ${params.username} | Takip ettikleri`
        window.scrollTo(0, 0);
        async function fetchData() {
            setLoading(true);
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username' , params?.username)
                if(profiles.length < 1) {
                    setError(true);
                }

            let { data: profilesAll } = await supabase
                .from('profiles')
                .select('*')
                setAllUsers(profilesAll ? profilesAll : null);

            let { data: following } = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id', profiles[0]?.user_id)

                setFollowingData(following ? following : null);

            let { data: follower } = await supabase
                .from('follows')
                .select('*')
                .eq('takipedilen_id', profiles[0]?.user_id)
                setFollowerData(follower ? follower : null)
                setLoading(false);
        }

        fetchData();
    }, [params])

    console.log(followingData)

    return (
        <div className="outlet-page">

            {
                loading === true ?
                <div className="loading-bg">
                    <div className="loading"></div>
                </div>
                :
                error === true ?
                <p className="warning">Kullanıcı bulunamadı!</p>
                :
                <div className="following-details-page">

                    <header>

                        <Link style={location.pathname.includes('following-details') ? {backgroundColor: '#e6e6e6'} : {}}>Takip edilen <span>{followingData?.length}</span></Link>
                        <Link to={`/${params?.username}/follower-details`}>Takipçi <span>{followerData?.length}</span></Link>

                    </header>

                    {
                        followingData?.length > 0 ?
                        followingData?.map(x => (

                            <Link to={`/profile/${allUsers.find(y => y.user_id === x.takipedilen_id)?.username || null}`} className="follow-details-user-box">

                                    {allUsers && (
                                        <img
                                            src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${allUsers.find(y => y.user_id === x.takipedilen_id)?.profile_pic || null}`}
                                        />
                                    )}

                                    <div>
                                        <h3>{allUsers.find(y => y.user_id === x.takipedilen_id)?.name || null} {allUsers.find(y => y.user_id === x.takipedilen_id)?.surname || null}</h3>
                                        <p>@{allUsers.find(y => y.user_id === x.takipedilen_id)?.username || null}</p>
                                    </div>
                                
                            </Link>

                        ))
                        :
                        <p className="warning">Takip edilen kullanıcı bulunmuyor.</p>
                    }

                </div>
            }

        </div>
    )
}