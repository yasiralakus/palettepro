import { useEffect, useState } from "react";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import { supabase } from "../App";

export async function loader( {params} ) {

    return params;
}

export default function FollowerDetails() {

    const params = useLoaderData();
    const [followingData, setFollowingData] = useState(null);
    const [followerData, setFollowerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState(null);
    const location = useLocation();
    const [error, setError] = useState(false);

    useEffect(() => {
        document.title = `PalettePro | ${params.username} | Takipçileri`
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
                <div className="follower-details-page">

                    <header>

                        <Link to={`/${params?.username}/following-details`} >Takip edilen <span>{followingData?.length}</span></Link>
                        <Link style={location.pathname.includes('follower-details') ? {backgroundColor: '#e6e6e6'} : {}} to={`/${params?.username}/follow-details`}>Takipçi <span>{followerData?.length}</span></Link>

                    </header>

                    {
                        followerData?.length > 0 ?
                        followerData?.map(x => (

                            <Link to={`/profile/${allUsers.find(y => y.user_id === x.takipeden_id)?.username || null}`} className="follow-details-user-box">

                                    {allUsers && (
                                        <img
                                            src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${allUsers.find(y => y.user_id === x.takipeden_id)?.profile_pic || null}`}
                                        />
                                    )}

                                    <div>
                                        <h3>{allUsers.find(y => y.user_id === x.takipeden_id)?.name || null} {allUsers.find(y => y.user_id === x.takipeden_id)?.surname || null}</h3>
                                        <p>@{allUsers.find(y => y.user_id === x.takipeden_id)?.username || null}</p>
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