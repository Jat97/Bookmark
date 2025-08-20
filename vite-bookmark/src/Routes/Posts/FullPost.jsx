import {useParams} from 'react-router-dom';
import {useFetchPosts, useFetchComments} from '../Functions/Queries/PostQueries';
import {bookStore} from '../../Context/bookStore';
import PostCard from './PostCard';

const FullPost = () => {
    const {postid} = useParams();

    const authorized = bookStore((state) => state.authorized);
    const setAuthorized = bookStore((state) => state.setAuthorized);
    const setSiteError = bookStore((state) => state.setSiteError);

    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    const commentData = useFetchComments([authorized, setAuthorized, setSiteError]);

    const current_post = postData.data.posts.find(post => post.id === postid);
    const post_comments = commentData.data.comments.filter(comment => comment.id)

    return (
        <div>
            <PostCard props={current_post} />

            {post_comments.map(comment => {
                return (
                    <div>
                        <Comment props={comment} />

                        {comment.replies.map(reply => {
                            return (
                                <div>
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