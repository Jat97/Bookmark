import {HandThumbDownIcon, HandThumbUpIcon} from "@heroicons/react/24/solid";
import {useLikeCommentMutation, useUnlikeCommentMutation, 
    useLikePostMutation, useUnlikePostMutation} from '../../Functions/Mutations/LikeMutations';
import {useBookStore} from '../../../Context/bookStore';

const LikeButton = ({logged, post}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const like_comment_mutation = useLikeCommentMutation([logged, post?.id, setSiteError]);
    const unlike_comment_mutation = useUnlikeCommentMutation([logged, post?.id, setSiteError]);
    const like_post_mutation = useLikePostMutation([logged, post?.id, setSiteError]);
    const unlike_post_mutation = useUnlikePostMutation([logged, post?.id, setSiteError]);

    const handleLikeMutations = () => {
        if(post.likes.some((like) => like.id === logged.id)) {
            if(post?.commenting_user) {
                return unlike_comment_mutation.mutate();
            }
            else {
                return unlike_post_mutation.mutate();
            }
        }
        else {
            if(post?.commenting_user) {
                return like_comment_mutation.mutate();
            }
            else {
                return like_post_mutation.mutate();
            }
        }
    }

    return (
        <button id={post?.id} data-testid={`like-${post?.id}`} className='cursor-pointer flex justify-center items-center 
            gap-x-2 text-amber-300 p-1 w-[100px] md:w-[150px]' 
            onClick={() => handleLikeMutations()}>
            {post?.likes?.some((like) => like.id === logged.id) ? 
                <HandThumbDownIcon className='fill-amber-300 h-4 md:h-6' />
            :
                <HandThumbUpIcon className='fill-amber-300 h-4 md:h-6' />
            }

            <span>
                {post?.likes?.some((like) => like.id === logged.id) ?
                    'Unlike'
                :
                    'Like'
                }
            </span>
        </button>
    )
};

export default LikeButton;