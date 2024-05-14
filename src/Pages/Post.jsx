import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { UserData, supabase } from "../App";
import rgbHex from 'rgb-hex';

export async function loader({ params }) {

    return params;
}

export default function Post() {

    const params = useLoaderData();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [postUser, setPostUser] = useState(null);
    const [postComments, setPostComments] = useState(null);
    const {user, setUser, notification, setNotification, openNotification, setOpenNotification} = useContext(UserData);
    const [isBookmark, setIsBookmark] = useState(null);
    const [isLike, setIsLike] = useState(null);
    const [likesCount, setLikesCount] = useState(null);
    const [openPostReport, setOpenPostReport] = useState(false);
    const [allCommentUsers, setAllCommentUsers] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    useEffect(() => {

        document.title = 'PalettePro | Post';
        window.scrollTo(0, 0);

        async function fetchData() {
            setLoading(true)
            setError(false)
            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .eq('post_id', params.post_id)
            setPost(posts ? posts[0] : null);
            if(posts.length < 1) {
                setError(true)
            }

            
            let { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', posts[0]?.user_id)
            setPostUser(profiles ? profiles[0] : null)

            
            let { data: comments } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', params.post_id)
                .order('created_at', { ascending: false });
            setPostComments(comments ? comments : null);

            let { data: profilesAll, error: errorProfiles } = await supabase
                .from('profiles')
                .select('*')
                .in('user_id', comments && comments.map(x => x.user_id))
            setAllCommentUsers(profilesAll ? profilesAll : null)

            const { data: { user } } = await supabase.auth.getUser();
            
            let { data: bookmarks, error: bookmarksError} = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', user?.id)
                .eq('post_id', params.post_id)
            setIsBookmark(bookmarks?.length > 0 ? true : false)

            let { data: likesCount } = await supabase
                .from('likes')
                .select('*')
                .eq('post_id', params.post_id)
            setLikesCount(likesCount ? likesCount.length : null);
            
            let { data: likes } = await supabase
                .from('likes')
                .select('*')
                .eq('post_id', params.post_id)
                .eq('user_id', user?.id)
            setIsLike(likes?.length > 0 ? true : false)


            setLoading(false);
        }

        fetchData();
    }, [])

    async function handleAddComment(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    user_id: user?.user_id,
                    comment: formObj.comment,
                    post_id: params.post_id
                }
            ])
            .select()

        if(!error) {
            setPostComments(prev => [...data, ...prev]);
            e.target.reset()
        }

    }

    async function handleBookmark(e) {
        e.preventDefault();

        if(isBookmark === true) {

            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', user?.user_id)
                .eq('post_id', params.post_id)

            setIsBookmark(false)
          
        } else {
            const { data, error } = await supabase
                .from('bookmarks')
                .insert([
                    {
                        post_id: params.post_id,
                        user_id: user?.user_id,
                    }
                ])
                .select()

            setIsBookmark(true)
            
        }
      
    }

    async function reportPost(e) {
        e.preventDefault();
        
        const { data, error } = await supabase
            .from('reports')
            .insert([
                {
                    reportedilen_post_id: params.post_id
                }
            ])
            .select()

            setOpenPostReport(false);
            setOpenNotification(true);
            setNotification('Paylaşım bildirildi.')

    }

    async function reportUser(e) {
        e.preventDefault();
        
        const { data, error } = await supabase
            .from('reports')
            .insert([
                {
                    reportedilen_user_id: post?.user_id
                }
            ])
            .select()
            setOpenPostReport(false)
            setOpenNotification(true);
            setNotification('Kullanıcı bildirildi.')
    }

    async function handleLike(e) {
        e.preventDefault();

        if(isLike === false) {
            const { data, error } = await supabase
                .from('likes')
                .insert([
                {
                    post_id: params.post_id
                }
                ])
                .select()
            setIsLike(true);
            setLikesCount(likesCount + 1);
        } else {
            
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('post_id', params.post_id)
                .eq('user_id', user?.user_id)
            setIsLike(false);
            setLikesCount(likesCount - 1);
        }
      
    }

    async function deleteThisPost(e) {
        e.preventDefault();
        const confirmDelete = window.confirm("Paylaşımı kaldırmak istediğinizden emin misiniz?");

        if(confirmDelete === true) {
            
            let { data: posts, error } = await supabase
                .from('posts')
                .delete('*')
                .eq('post_id', post?.post_id)

                if(!error) {
                    navigate('/');
                    setOpenNotification(true);
                    setNotification('Paylaşım başarıyla kaldırıldı!')
                }

        }
    }

    return (
        <div className="outlet-page">

            <div className="post-page">

                {
                    error === true ? '' :
                    loading === false &&
                    user?.user_id !== postUser?.user_id ?
                    <div className="report-post">
                        <button onClick={() => (openPostReport === true ? setOpenPostReport(false) : setOpenPostReport(true))}><i className="fa-solid fa-flag"></i></button>
                        {openPostReport === true && 
                        <div>
                            <button onClick={reportPost}>Paylaşımı bildir!</button>
                            <button onClick={reportUser}>Kullanıcıyı bildir!</button>
                        </div>
                        }
                    </div>
                    :
                    loading === false &&
                    <button onClick={deleteThisPost} className="delete-post"><i className="fa-solid fa-trash"></i></button>
                }

                {loading === true ?
                <div className="loading-bg">
                    <div className="loading"></div>
                </div>
                :

                error === true ?
                <p className="warning">Paylaşım bulunamadı!</p>
                :
                <div className="post-page-post-details">

                    <div className="post-page-user-details">

                        <img src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${postUser?.profile_pic}`} alt="" />

                        <div>
                            <h3>{postUser?.name} {postUser?.surname}</h3>
                            <p><Link to={`/profile/${postUser?.username}`}>@{postUser?.username}</Link> - {Math.floor(Math.abs(new Date() - new Date(post?.created_at)) / 3600000) < 1 ? `${Math.floor(Math.abs(new Date() - new Date(post?.created_at)) / 60000)} dakika önce` : `${Math.floor(Math.abs(new Date() - new Date(post?.created_at)) / 3600000)} saat önce`}</p>
                        </div>

                    </div>

                    <p>{post?.post_title}</p>

                    <div className="post-page-post-colors">

                        {post?.color_1 !== null &&
                            <div onClick={() => (navigator.clipboard.writeText(post?.color_1), setOpenNotification(true), setNotification(`Kopyalama Başarılı! ${post?.color_1}`))} style={{backgroundColor: post?.color_1}}>
                                <p style={post?.color_1.slice(1,3) === '00' ? {color: '#fff'} : {}}>{post?.color_1}</p>
                            </div>
                        }
                        {post?.color_2 !== null &&
                            <div onClick={() => (navigator.clipboard.writeText(post?.color_2), setOpenNotification(true), setNotification(`Kopyalama Başarılı! ${post?.color_2}`))} style={{backgroundColor: post?.color_2}}>
                                <p>{post?.color_2}</p>
                            </div>
                        }
                        {post?.color_3 !== null &&
                            <div onClick={() => (navigator.clipboard.writeText(post?.color_3), setOpenNotification(true), setNotification(`Kopyalama Başarılı! ${post?.color_3}`))} style={{backgroundColor: post?.color_3}}>
                                <p>{post?.color_3}</p>
                            </div>
                        }
                        {post?.color_4 !== null &&
                            <div onClick={() => (navigator.clipboard.writeText(post?.color_4), setOpenNotification(true), setNotification(`Kopyalama Başarılı! ${post?.color_4}`))} style={{backgroundColor: post?.color_4}}>
                                <p>{post?.color_4}</p>
                            </div>
                        }
                        {post?.color_5 !== null &&
                            <div onClick={() => (navigator.clipboard.writeText(post?.color_5), setOpenNotification(true), setNotification(`Kopyalama Başarılı! ${post?.color_5}`))} style={{backgroundColor: post?.color_5}}>
                                <p>{post?.color_5}</p>
                            </div>
                        }
                        {post?.color_6 !== null &&
                            <div onClick={() => (navigator.clipboard.writeText(post?.color_6), setOpenNotification(true), setNotification(`Kopyalama Başarılı! ${post?.color_6}`))} style={{backgroundColor: post?.color_6}}>
                                <p>{post?.color_6}</p>
                            </div>
                        }

                    </div>

                    {user ? 
                    <div className="post-page-post-interaction">

                        <button style={isLike === true ? {backgroundColor: '#ffb3b3', color: '#f00'} : {}} onClick={handleLike}><i className="fa-solid fa-heart"></i> {likesCount}</button>
                        <button style={isBookmark === true ? {backgroundColor: '#ffff99', color: '#ffcc00'} : {}} onClick={handleBookmark}><i className="fa-solid fa-star"></i></button>
                        <button onClick={() => (navigator.clipboard.writeText(window.location.href), setOpenNotification(true), setNotification(`Bağlantı kopyalandı!`))}><i className="fa-solid fa-share"></i></button>

                    </div>
                    :
                    <p className="warning">Beğenmek ve kaydetmek için <Link to={'/authentication'}>giriş yap</Link>malısınız.</p>
                    }

                    <div className="post-page-post-comments">

                        <h1>Yorumlar</h1>

                        { user ?
                        postComments?.length > 0 ?
                            postComments?.map(x => (
                                <div key={x.comment_id} className="comment-item">

                                    <div>
                                    {allCommentUsers && (
                                        <img
                                            src={`https://maqxohpksrxtwrnkncom.supabase.co/storage/v1/object/public/${allCommentUsers.find(y => y.user_id === x.user_id)?.profile_pic || null}`}
                                        />
                                    )}
                                        <div>
                                            <h3>{allCommentUsers.map(y => y.user_id === x.user_id && y.name)} {allCommentUsers.map(y => y.user_id === x.user_id && y.surname)}</h3>
                                            <p><Link to={`/profile/${allCommentUsers.find(y => y.user_id === x.user_id)?.username || null}`}>@{allCommentUsers.map(y => y.user_id === x.user_id && y.username)}</Link> - {Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000) < 1 ? `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 60000)} dakika önce` : `${Math.floor(Math.abs(new Date() - new Date(x.created_at)) / 3600000)} saat önce`}</p>
                                        </div>
                                    </div>

                                    <p>{x.comment}</p>

                                </div>
                            )) :
                            <p className="warning">Henüz yorum bulunmuyor.</p>
                            :
                            <p className="warning">Yorumları görüntülemek için <Link to={'/authentication'}>giriş yap</Link>malısınız.</p>
                    }

                        {user ? 
                        <form onSubmit={handleAddComment}>
                            <textarea name="comment" id="" placeholder="Düşüncelerini yaz..." rows={5}></textarea>
                            <button>Yorum Yap</button>
                        </form>
                        :
                        <p className="warning">Yorum yapmak için <Link to={'/authentication'}>giriş yap</Link>malısınız.</p>
                        }

                    </div>

                </div>
            }


            </div>

        </div>
    )
}