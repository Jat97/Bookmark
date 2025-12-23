import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUturnLeftIcon, ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";
import {useBookStore} from '../../Context/bookStore';
import {useFetchLogged} from '../Functions/Queries/UserQueries';
import {useSharePostMutation} from '../Functions/Mutations/PostMutations';
import LikeButton from '../Buttons/LikeButton';
import TextBox from '../Miscellaneous/Inputs/TextBox';

const PostCommentBox = (props) => {
    const post = props.props;

    const [displayTextBox, setDisplayTextBox] = useState(false);

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const shareMutation = useSharePostMutation([post.id, setSiteError]);

    const toggleTextBox = () => {
        setDisplayTextBox(displayTextBox ? false : true);
    }

    const sharePost = () => {
        shareMutation.mutate();
    }

    return (
        <div className='bg-orange-200 p-2 w-full'>
            {post.likes.length === 0 ?
                null
            :
                <div className='flex justify-evenly items-center'>
                    {post.likes.slice(0, 3).map(like => {
                        return (
                            <Link to={`/api/users/${like.id}`} className='text-blue-600 hover:underline'> 
                                {`${like.first_name} ${like.last_name}`} 
                            </Link>
                        )
                    })}

                    {post.likes.length > 3 &&
                        <p> and <span className='text-blue-600 hover:underline'> {post.likes.length} others </span> </p>
                    }

                    liked this
                </div>
            }
            
            <div className='text-orange-300 flex justify-evenly items-center'>
                <LikeButton props={[loggedData.data.logged_user, post]} />

                <button type='button' className='cursor-pointer flex justify-around items-center 
                    w-[75px] md:w-[100px] hover:underline' 
                    onClick={() => sharePost()}>
                    <ArrowUturnLeftIcon className='h-6' />

                    Share
                </button>

                <button type='button' className='cursor-pointer flex justify-around items-center 
                    w-[100px] md:w-[125px] hover:underline' 
                    onClick={() => toggleTextBox()}>
                    <ChatBubbleLeftRightIcon className='h-6' />

                    Comment
                </button>
            </div>

            {displayTextBox && 
                <TextBox props={['', '']} />
            }
        </div>
    )
}

export default PostCommentBox;