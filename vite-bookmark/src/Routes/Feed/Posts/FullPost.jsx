import {useParams} from 'react-router-dom';
import {useFetchLogged} from '../../Functions/Queries/UserQueries';
import {useFetchPosts, useFetchComments} from '../../Functions/Queries/PostQueries';
import {useBookStore} from '../../../Context/bookStore';
import PostCard from './PostCard';
import Comment from '../Comments/Comment';
import TextBox from '../../Miscellaneous/Inputs/TextBox';
import FullPostLoad from '../../Miscellaneous/Loading/Feed/FullPostLoad';

const FullPost = () => {
    const {postid} = useParams();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    const commentData = useFetchComments([postid, authorized, setAuthorized, setSiteError]);

    const current_post = postData.data?.posts.find(post => post.id.toString() === postid);

    if(postData.isPending) {
        return <FullPostLoad />
    }
    else {
        return (
            <div className='flex flex-col items-start gap-4 border border-slate-200 m-5 md:w-1/2'>
                <PostCard 
                    post={current_post} 
                    logged={loggedData.data?.profile.id} 
                />

                <div className='flex flex-col items-center w-full'>
                    <TextBox post={current_post} poster={loggedData.data?.profile} for_comment={true} />
                </div>
            
                {commentData.data?.comments?.map(comment => {
                    return (
                        <div className='flex flex-col gap-3 border border-slate-200 md:w-full'>
                            <Comment 
                                comment={comment} 
                                is_logged={loggedData.data?.profile.id === comment?.commenting_user.id}
                            />

                            {comment.replies.map(reply => {
                                return (
                                    <div className='ml-10 md:w-2/3'>
                                        <Comment 
                                            comment={reply} 
                                            logged={loggedData.data?.profile.id} 
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        ) 
    } 
}

export default FullPost;