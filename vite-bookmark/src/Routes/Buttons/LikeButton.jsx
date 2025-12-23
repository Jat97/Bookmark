import {HandThumbDownIcon, HandThumbUpIcon} from "@heroicons/react/24/solid";
import {useLikeCommentMutation, useUnlikeCommentMutation, 
    useLikePostMutation, useUnlikePostMutation} from '../Functions/Mutations/LikeMutations';
import {useBookStore} from '../../Context/bookStore';

const LikeButton = (props) => {
    const logged = props.props[0];
    const post = props.props[1];

    const setSiteError = useBookStore((state) => state.setSiteError);

    const like_comment_mutation = useLikeCommentMutation([logged, post.id, setSiteError]);
    const unlike_comment_mutation = useUnlikeCommentMutation([logged, post.id, setSiteError]);
    const like_post_mutation = useLikePostMutation([logged, post.id, setSiteError]);
    const unlike_post_mutation = useUnlikePostMutation([logged, post.id, setSiteError]);

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
        <button id={post.id} data-testid={`like-${post.id}`} className='text-orange-300 cursor-pointer w-[75px] 
            hover:underline' 
            onClick={() => handleLikeMutations()}>
            {post.likes.some((like) => like.id === logged.id) ?
                <div className='flex justify-around items-center'>
                    <HandThumbDownIcon className='h-6 fill-orange-300' />
                    Unlike
                </div>
            :       
                <div className='flex justify-around items-center'>
                    <HandThumbUpIcon className='h-6 fill-orange-300' />
                    Like
                </div>
            }
        </button>
    )
};

export default LikeButton;