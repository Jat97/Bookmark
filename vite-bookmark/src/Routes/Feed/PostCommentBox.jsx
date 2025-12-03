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
        <div>
            {post.likes.length === 0 ?
                null
            :
                <div className='flex justify evenly items-center'>
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
            
            <div className='flex justify-evenly items-center border border-orange-200'>
                <LikeButton props={[loggedData.data.logged_user, post]} />

                <button type='button' className='border-l-orange-200 border-r-orange-200' onClick={() => sharePost()}>
                    <ArrowUturnLeftIcon className='h-6 fill-orange-200' />

                    Share
                </button>

                <button type='button' onClick={() => toggleTextBox()}>
                    <ChatBubbleLeftRightIcon className='h-6 fill-orange-200' />

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