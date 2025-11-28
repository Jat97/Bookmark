import {useParams} from 'react-router-dom';
import {useFetchPosts, useFetchComments} from '../../Functions/Queries/PostQueries';
import {useBookStore} from '../../../Context/bookStore';
import PostCard from './PostCard';

const FullPost = () => {
    const {postid} = useParams();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    const commentData = useFetchComments([authorized, setAuthorized, setSiteError]);

    const current_post = postData.data.posts.find(post => post.id === postid);
    const post_comments = commentData.data.comments.filter(comment => comment.id)

    return (
        <div>
            <PostCard props={current_post} />

            {post_comments.map(comment => {
                return (
                    <div className='border-l-slate-200'>
                        <Comment props={comment} />

                        {comment.replies.map(reply => {
                            return (
                                <div className='border-l-slate-200'>
                                    <Comment props={reply} />
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default FullPost;