import {HandThumbDownIcon, HandThumbUpIcon} from "@heroicons/react/24/solid";
import {useFetchLogged} from '../Functions/Queries/UserQueries';
import {useLikeCommentMutation, useUnlikeCommentMutation, 
    useLikePostMutation, useUnlikePostMutation} from '../Functions/Mutations/LikeMutations';
import {bookStore} from '../../Context/bookStore';

const LikeButton = (props) => {
    const logged = props.props[0];
    const post = props.props[1];

    const setSiteError = bookStore((state) => state.setSiteError);

    const like_comment_mutation = useLikeCommentMutation([post, setSiteError]);
    const unlike_comment_mutation = useUnlikeCommentMutation([post, setSiteError]);
    const like_post_mutation = useLikePostMutation([post, setSiteError]);
    const unlike_post_mutation = useUnlikePostMutation([post, setSiteError]);

    const handleLikeMutations = () => {
        if(post.likes.some((like) => like.id === logged.id)) {
            if(post.reply_to) {
                return unlike_comment_mutation.mutate();
            }
            else {
                return unlike_post_mutation.mutate();
            }
        }
        else {
            if(post.reply_to) {
                return like_comment_mutation.mutate();
            }
            else {
                return like_post_mutation.mutate();
            }
        }
    }

    return (
        <button onClick={() => handleLikeMutations()}>
            {post.likes.some((like) => like.id === loggedData.data.logged_user.id) ?
                <div>
                    <HandThumbDownIcon className='h-6' />
                    Unlike
                </div>
            :       
                <div>
                    <HandThumbUpIcon className='h-6' />
                    Like
                </div>
            }
        </button>
    )
};

export default LikeButton;