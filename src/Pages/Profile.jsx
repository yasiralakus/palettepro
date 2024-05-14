import { useContext, useEffect, useState } from "react"
import { Link, useLoaderData } from "react-router-dom"
import { UserData, supabase } from "../App";

export async function loader( {params}) {

    return params;
}

export default function Profile() {

    const params = useLoaderData();

    const [profileData, setProfileData] = useState(null);
    const [profilePostData, setProfilePostData] = useState(null);
    const [profileLikedPostData, setProfileLikedPostData] = useState(null);
    const [loading, setLoading] = useState(false);
    const {user, setUser, notification, setNotification, openNotification, setOpenNotification, setFilteredUsers} = useContext(UserData);
    const [allUser, setAllUsers] = useState(null);
    const [isFollow, setIsFollow] = useState(null);
    const [followerCount, setFollowerCount] = useState(null);
    const [followingCount, setFollowingCount] = useState(null);
    const [openReport, setOpenReport] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        document.title = `PalettePro | ${params.username}`
        window.scrollTo(0, 0);
        setFilteredUsers(null)
        async function fetchData() {
            setLoading(true)
            setError(false)
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', params.username)
                if(profiles?.length < 1) {
                    setError(true);
                }
                setProfileData(profiles ? profiles[0] : null)


            let { data: profilesAll } = await supabase
                .from('profiles')
                .select('*')
                setAllUsers(profilesAll ? profilesAll : null)

            let { data: posts } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', profiles[0]?.user_id)
                .order('created_at', { ascending: false });

                setProfilePostData(posts ? posts : null);

            
            let { data: likes } = await supabase
                .from('likes')
                .select('*')
                .eq('user_id', profiles[0]?.user_id)

            
            let { data: postsLikes } = await supabase
                .from('posts')
                .select('*')
                .in('post_id', likes && likes.map(x => x.post_id))
                setProfileLikedPostData(postsLikes ? postsLikes : null)

            const { data: { user } } = await supabase.auth.getUser();
            
            let { data: follows } = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id', user?.id)
                .eq('takipedilen_id', profiles[0]?.user_id)
                setIsFollow(follows?.length > 0 ? true : false);

            let { data: following } = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id', profiles[0]?.user_id)
                setFollowingCount(following ? following.length : null)

            let { data: followers } = await supabase
                .from('follows')
                .select('*')
                .eq('takipedilen_id', profiles[0]?.user_id)
                setFollowerCount(followers ? followers.length : null)

            setLoading(false);
        }
        fetchData();
    }, [params])

    const [profilePageStep, setProfilePageStep] = useState(1);

    async function handleFollow(e) {
        e.preventDefault();
        
        if(isFollow === false) {
            const { data, error } = await supabase
            .from('follows')
            .insert([
                {
                    takipedilen_id: profileData?.user_id
                }
            ])
            .select()
            setIsFollow(true)
            setFollowerCount(followerCount + 1)
        } else {
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('takipeden_id', user?.user_id)
                .eq('takipedilen_id', profileData?.user_id)
                setIsFollow(false)
            setFollowerCount(followerCount - 1)

            }

    }

    async function reportThisUser(e) {
        e.preventDefault();
        
        const { data, error } = await supabase
            .from('reports')
            .insert([
                {
                    reportedilen_user_id: profileData?.user_id
                }
            ])
            .select()
            setOpenReport(false)
            setOpenNotification(true);
            setNotification('Kullanıcı bildirildi.')
    }

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

                profileData &&

            <div className="profile-page">

                <div className="profile-details">

                    <div className="profile-details-picture">

                        <img id="cover-photo" src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${profileData?.cover_pic}`} alt="" />

                        <img id="profile-photo" src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${profileData?.profile_pic}`} alt="" />

                        <div>
                            <div>
                                <h3>{profileData?.name} {profileData?.surname}</h3>
                                <h6>@{profileData?.username}</h6>
                                <div className="follow-box">
                                    <Link to={`/${profileData?.username}/following-details`}><span>{followingCount}</span> Takip Edilen</Link>
                                    <Link to={`/${profileData?.username}/follower-details`}><span>{followerCount}</span> Takipçi</Link>
                                </div>
                            </div>

                                {user && (
                                    user.user_id === profileData?.user_id ? (
                                        <>
                                            <Link to={`/edit-profile/${profileData?.username}`}><i className="fa-solid fa-pen"></i></Link>
                                            <button><i className="fa-solid fa-ellipsis-vertical"></i></button>
                                        </>
                                    ) : (
                                        <>
                                            <button style={isFollow === true ? {backgroundColor: '#b3ffb3', color: '#00b300'} : {}} onClick={handleFollow}>{isFollow === true ? <i className="fa-solid fa-user-xmark"></i> : <i className="fa-solid fa-user-check"></i>}</button>
                                            
                                            <div onClick={() => (openReport === true ? setOpenReport(false) : setOpenReport(true))} className="report-this-user">
                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                                {openReport === true && <button onClick={reportThisUser}>Kullanıcıyı bildir!</button>}
                                            </div>
                                        </>
                                    )
                                )}
                        </div>

                    </div>

                </div>

                <div className="profile-steps">

                    <button style={profilePageStep === 1 ? {backgroundColor: '#D2E3FF', color: '#0055FF'} : {}} onClick={() => (setProfilePageStep(1))}>Paylaşımlar</button>
                    <button style={profilePageStep === 2 ? {backgroundColor: '#D2E3FF', color: '#0055FF'} : {}} onClick={() => (setProfilePageStep(2))}>Hakkında</button>
                    <button style={profilePageStep === 3 ? {backgroundColor: '#D2E3FF', color: '#0055FF'} : {}} onClick={() => (setProfilePageStep(3))}>Beğeniler</button>
                    

                </div>

                {profilePageStep === 1 && 
                <div className="palette-items">

                    {profilePostData?.length > 0 ? 
                        profilePostData.map(x => (
                            <Link to={`/post/${x.username}/${x.post_id}`} key={x.post_id} className="palette-item">

                            <div className="palette-item-user-details">

                                <img src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${profileData?.profile_pic}`} alt="" />

                                <div>
                                    <h3>{profileData?.name} {profileData?.surname}</h3>
                                    <p><span>@{profileData?.username}</span> - {Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000) < 1 ? `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 60000)} dakika önce` : `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000)} saat önce`}</p>
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
                        :
                        <p className="warning">Henüz bir paylaşımı bulunmuyor.</p>
                    }

                </div>
                }

                {profilePageStep === 2 &&
                    <div className="profile-biography">

                        {profileData?.biography ? <p>{profileData?.biography}</p> : ''}

                        <p>Katılma Tarihi: {profileData?.created_at && new Date(profileData.created_at).toLocaleString()}</p>

                        <div>
                            {profileData?.instagram !== null  && profileData?.instagram !== '' && <Link to={`https://www.instagram.com/${profileData?.instagram}`}><i className="fa-brands fa-instagram"></i></Link>}
                            {profileData?.twitter !== null  && profileData?.twitter !== '' && <Link to={`https://www.twitter.com/${profileData?.twitter}`}><i className="fa-brands fa-twitter"></i></Link>}
                            {profileData?.facebook !== null  && profileData?.facebook !== '' && <Link to={`https://www.facebook.com/${profileData?.facebook}`}><i className="fa-brands fa-facebook-f"></i></Link>}
                            {profileData?.linkedin !== null  && profileData?.linkedin !== '' && <Link to={`https://www.linkedin.com/in/${profileData?.linkedin}`}><i className="fa-brands fa-linkedin-in"></i></Link>}
                            {profileData?.github !== null  && profileData?.github !== '' && <Link to={`https://www.github.com/${profileData?.github}`}><i className="fa-brands fa-github"></i></Link>}
                        </div>


                    </div>
                }

                        

                {profilePageStep === 3 && 
                    <div className="palette-items">

                        {profileLikedPostData?.length > 0 ? 
                            profileLikedPostData?.map(x => (
                                <Link to={`/post/${x.username}/${x.post_id}`} key={x.post_id} className="palette-item">

                                <div className="palette-item-user-details">

                                {allUser && (
                                    <img
                                        src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${allUser.find(y => y.user_id === x.user_id)?.profile_pic || null}`}
                                    />
                                )}

                                    <div>
                                        <h3>{allUser?.map(y => (y.user_id === x.user_id && y.name))} {allUser?.map(y => (y.user_id === x.user_id && y.surname))}</h3>
                                        <p><span>@{allUser?.map(y => (y.user_id === x.user_id && y.username))}</span> - {Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000) < 1 ? `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 60000)} dakika önce` : `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000)} saat önce`}</p>
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
                            :
                            <p className="warning">Beğenilen bir paylaşım bulunamadı.</p>
                        }

                    </div>
                    }
            
            </div>
        }
        </div>
    )
}