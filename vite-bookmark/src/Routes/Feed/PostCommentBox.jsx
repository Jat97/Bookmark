import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUturnLeftIcon, ChatBubbleLeftRightIcon, ChatBubbleOvalLeftIcon, HandThumbUpIcon} from "@heroicons/react/24/solid";
import {useBookStore} from '../../Context/bookStore';
import {useFetchLogged} from '../Functions/Queries/UserQueries';
import {useSharePostMutation} from '../Functions/Mutations/PostMutations';
import LikeButton from '../Buttons/Post/LikeButton';
import TextBox from '../Miscellaneous/Inputs/TextBox';

const PostCommentBox = ({post}) => {
    const [textDisplay, setTextDisplay] = useState(false);

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = !is_guest && useFetchLogged([authorized, setAuthorized, setSiteError]);
    const shareMutation = useSharePostMutation([post?.id, setSiteError]);

    const toggleTextBox = () => {
        setTextDisplay(textDisplay ? false : true);
    }

    const sharePost = () => {
        shareMutation.mutate();
    }

    return (
        <div className='flex flex-col items-start gap-3 bg-orange-700/50 p-2 w-full'>
            {post?.likes?.length > 0 &&
                <div className='flex justify-start items-center gap-x-3 border-b-1 border-slate-100 border-solid 
                    p-1 w-full'>
                    <HandThumbUpIcon className='h-4 fill-amber-300 md:h-6' /> 
                    
                    {post.likes.slice(0, 3).map(like => {
                        return <Link to={`/api/users/${like.id}`} className='font-semibold text-sky-600 hover:underline'> 
                                {`${like?.first_name} ${like.last_name}`} 
                            </Link>
                    })}

                    {post.likes.length > 3 && <span> and {post.likes?.length} others </span>}
                </div>
            } 
            
            {!is_guest && 
                <div className={`text-amber-300 grid items-center md:w-full 
                        ${post.commenting_user ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    <LikeButton logged={loggedData.data?.profile} post={post} />

                    <button type='button' className={`cursor-pointer flex justify-center items-center gap-x-2 
                        w-[75px] p-1 md:w-[150px] ${post.commenting_user && 'hidden'}`} 
                        onClick={() => sharePost()}>
                        <ArrowUturnLeftIcon className='h-4 md:h-6' />

                        Share
                    </button>

                    {post?.commenting_user || post?.commenting_group ?
                        <button type='button' className='cursor-pointer flex justify-center items-center gap-x-2
                            text-sm w-[125px] md:text-base md:w-[150px]' onClick={() => toggleTextBox()}>
                            <ChatBubbleOvalLeftIcon className='h-4 stroke-amber-300 md:h-6' />

                            Comment
                        </button>
                    :
                        <Link to={`/api/post/${post?.id}/comments`} className='cursor-pointer flex justify-center items-center 
                            gap-x-2 text-sm p-1 w-[125px] md:text-base md:w-[125px]'>
                            <ChatBubbleLeftRightIcon className='h-4 md:h-6' />

                            Comments
                        </Link>
                    }
                </div>
            }
            

            {((post?.commenting_user || post?.commenting_group) && textDisplay) && 
                <TextBox post={post} poster={loggedData.data?.profile} for_comment={true} cancel_fn={toggleTextBox} />
            }
        </div>
    )
}

export default PostCommentBox;